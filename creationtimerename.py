import os
import sys
import time
from pathlib import Path

def get_creation_time(file_path):
    """
    Get the creation time of a file and return it in a format suitable for sorting.
    """
    stat = os.stat(file_path)
    creation_time = stat.st_birthtime
    # creation_time = os.path.getctime(file_path)

    return time.strftime('%Y%m%d_%H%M%S', time.localtime(creation_time))

def rename_files_in_directory(input_directory, output_directory):
    """
    Rename all files in the given directory by prepending the creation timestamp.
    """
    with os.scandir(input_directory) as entries:
        for entry in entries:
            if entry.is_file():
                creation_timestamp = get_creation_time(entry.path)
                new_name = f"{creation_timestamp}_{entry.name}"
                # new_name = f"{creation_timestamp}"
                new_path = Path(output_directory) / new_name
                os.rename(entry.path, new_path)
                print(f"Renamed '{entry.name}' to '{new_name}'")

def create_directory_if_not_exists(directory_path):
    """
    Create a directory at the specified path if it doesn't already exist.

    Args:
    directory_path (str): Path of the directory to create.
    """
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
        print(f"Directory created at: {directory_path}")
    else:
        print(f"Directory already exists at: {directory_path}")

def main():
    if len(sys.argv) != 3:
        print("Usage: python renametocreationtime.py <input_directory> <output_directory>")
        sys.exit(1)

    directory_path = sys.argv[1]
    if not os.path.isdir(directory_path):
        create_directory_if_not_exists(directory_path)
        if not os.path.isdir(directory_path):
            print(f"Error: '{directory_path}' is not a valid directory.")
            sys.exit(1)

    output_path = sys.argv[2]
    if not os.path.isdir(output_path):
        create_directory_if_not_exists(output_path)
        if not os.path.isdir(output_path):
            print(f"Error: '{output_path}' is not a valid directory.")
            sys.exit(1)

    rename_files_in_directory(directory_path, output_path)

if __name__ == "__main__":
    main()
