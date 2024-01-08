// Clip length at start of film
var MIN_CLIP_LENGTH_SECONDS = 1.0;

// Clip length at end of film
var MAX_CLIP_LENGTH_SECONDS = 4.0; 

// Folders with video footage
var INPUT_FOLDERS = ["Indexed Footage"];

var oldJavascript = true;

if (oldJavascript) {
    Array.prototype.includes = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) { return true; }
        }
        return false;
    }

    ProjectItemCollection.prototype.forEach = function (callback, thisArg) {
        if (this == null) {
            throw new TypeError('Array.prototype.forEach called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        var T, k;
        var O = Object(this);
        var len = O.length >>> 0;

        if (arguments.length > 1) {
            T = thisArg;
        }

        k = 0;

        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}

function linearRange(min, max, size) {
    if (size <= 1) {
        return size === 1 ? [min] : [];
    }

    var range = [];
    var step = (max - min) / (size - 1);

    for (var i = 0; i < size; i++) {
        range.push(min + i * step);
    }

    return range;
}


function importAndTrim() {
    var project = app.project;

    // Function to import a folder of videos
    function importFolder(folderPath) {
        var folder = new Folder(folderPath);
        if (folder.exists) {
            var files = folder.getFiles();
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file instanceof File && isVideoFile(file.name)) {
                    project.importFiles([file.fsName]);
                }
            }
        }
    }

    // Check if the file is a video (basic check)
    function isVideoFile(fileName) {
        var videoExtensions = ['.mp4', '.mov', '.avi', '.mkv']; // Add more as needed
        var extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
        return videoExtensions.includes(extension);
    }

    // Function to get a random start point within the clip
    function insertRandomlyTrimmedClip(sequence, clip, maxClipLengthSeconds) {
        var clipDurationTicks = Number(clip.getOutPoint().ticks) - Number(clip.getInPoint().ticks); // Duration in ticks
        var maxDurationTicks = maxClipLengthSeconds * 254016000000; // Convert seconds to ticks

        if (clipDurationTicks <= maxDurationTicks) {
            maxDurationTicks = clipDurationTicks
        }

        // Calculate a random start point d
        var randomStartTicks = Math.floor(Math.random() * (clipDurationTicks - maxDurationTicks));
        var randomEndTicks = randomStartTicks + maxDurationTicks;

        app.trace("randomStartTicks: " + randomStartTicks)
        app.trace("randomEndTicks: " + randomEndTicks)

        // Trim the new track item to the random segment
        clip.setInPoint(String(randomStartTicks), 4);
        clip.setOutPoint(String(randomEndTicks), 4);
        var track = sequence.videoTracks[0];
        trackItem = track.insertClip(clip, 0);
    }


    // Main code
    app.enableQE();
    var videoFolders = INPUT_FOLDERS; // Add folder paths
    videoFolders.forEach(function (folder) {
        importFolder(folder);
    });

    // Assuming import is synchronous and files are added to project
    var importedClips = project.rootItem.children;
    var importedClipsSorted = []
    
    // Loop through ProjectItemCollection and add items to an array
    for (var i = 0; i < importedClips.numItems; i++) {
        importedClipsSorted.push(importedClips[i]);
    }

    // Reverse sort the array alphabetically by item name
    importedClipsSorted.sort(function (a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return 1;
        }
        if (nameA > nameB) {
            return -1;
        }

        // names must be equal
        return 0;
    });

    // Create a new sequence
    var sequence = project.createNewSequence("My Sequence", "id");

    var clipLengthRange = linearRange(MIN_CLIP_LENGTH_SECONDS, MAX_CLIP_LENGTH_SECONDS, importedClipsSorted.length);
    var index = importedClipsSorted.length - 1;

    // Add clips to sequence and trim
    importedClipsSorted.forEach(function (clip) {
        // Vary over range of possible clip lengths
        insertRandomlyTrimmedClip(sequence, clip, clipLengthRange[index])
        index--;
    });
}


importAndTrim();
