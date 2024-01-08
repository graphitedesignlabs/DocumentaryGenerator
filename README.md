Automatic Documentary Video Generator
=====================================

Takes a folder with video footage and sequences a film using random time 
slices from each video. You set the input folders and the start, mid, 
and end time windows. The program does the rest. Each time you run this, 
you will end up with a slightly different documentary movie from the same 
set of footage. Videos are sequenced alphabetically. If you want to sequence 
them by creation timestamp, then run the included phython script first to
rename them.

Ingredients
-----------

- Apple Photos
- Adobe Premiere
- autotimeline.jsx
- creationtimerename.py

Steps
-----

1) Export your footage into a folder, e.g. "Original Footage." The 
   program uses the file creation dates to sequence your final film.

2) Change the name of all the videos so they are alphabetically sortable
   by creation date using the provided script.
   
   ```
   python renametocreationtime.py <input_directory> <output_directory>
   ```
   e.g.: 
   ```
   python renametocreationtime.py "Original Footage" "Indexed Footage"
   ```

3) Install ExtendScript from Adobe Creative Cloud Marketplace (search 
   within Plugins).

4) Edit autotimeline.jsx. Update INPUT_FOLDERS to the folder where you 
   sent all the renamed footage files. You can also change 
   MIN_CLIP_LENGTH_SECONDS and MAX_CLIP_LENGTH_SECONDS to change the 
   pacing of the film.

5) Run the script. (You may need to accept a dialog box that appears.)

6) Preview and export the movie! (Note that there is a bug where any clips
   without soundtracks will break the sequence. You may have to remove 
   from your input folder.)

7) Make some popcorn. Watch the movie.
