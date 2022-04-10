from pathlib import Path
from route import Route
import json, os


#################################################
##              Tracker I/O logic              ##
#################################################

##                                             ##
##                  Attributes                 ##
##                                             ##

data_dir = '../data/'
out_dir = '../../tracker/data/'
found_current = False
found_files = []

##                                             ##
##                Data directory               ##
##                                             ##

for file in os.listdir(data_dir):
    # Get file stem (without extension)
    file_stem = Path(file).stem

    # Check if file is in data directory and ends by .txt
    is_in_data = os.path.isfile(os.path.join(data_dir, file_stem + '.txt'))
    
    # Check if file is in out directory and ends by .json
    is_in_out = os.path.isfile(os.path.join(out_dir, file_stem + '.json'))

    # Just save files that are not in out directory
    if is_in_data and not is_in_out:
        found_current = Route(data_dir + file).save(out_dir)
        if found_current:
            print('FILE WILL BE SAVED (CURRENT ROUTE): ', file)
        else:
            print('FILE WILL BE SAVED (COMPLETED ROUTE): ', file)
    
    # File is not to be saved
    if is_in_data and is_in_out and not found_current:
        print('FILE WON\'T BE SAVED: ', file)

# Delete current route if needed
if not found_current:
    file = out_dir + 'current.json'
    if os.path.exists(file):
        os.remove(file)

##                                             ##
##                Out directory                ##
##                                             ##

for file in os.listdir(out_dir):
    # Just save files that end by .json and is not self
    print(file)
    if file.endswith('.json') and file != 'records.json':
        found_files.append(file)

# Create file
records_file = open(out_dir + 'records.json', 'w')

# Create JSON
records = json.dumps({"routes": found_files,})

# Save JSON into file
records_file.write(records)

#################################################
##                 End of file                 ##
#################################################



