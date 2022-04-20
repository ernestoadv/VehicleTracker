# Measurements

Data processing. These *.py* files extract measurements such as speed, distance and time from all existent routes.

## Usage

Save in **/data** *.txt* files with lines containing a *timestamp* in seconds, *latitude* and *longitude*, all separated by commas. Sample files are provided for testing purposes. Run **tracker.py** using *python3*. This will generate a *.json* for each existing data file in **/data** as well as a *records.json*. This last file contains all existing files which the web server will need for displaying data. These *.json* files will be saved in **../tracker/data**. The **tracker** will use these files in order to display the routes on a map.

## Requirements

- Python >= 3.9