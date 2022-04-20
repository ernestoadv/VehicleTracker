# GPS

GPS handling. Contains the necessary files in order to receive and deliver the GPS coordinates between nodes.

## Usage

Files starting with **gps** are installed in the *GPS reception node* whereas files starting with **regps** are installed in the *processing node*. The first node will receive coordinates and then send them to the processing node via **MQTT**. The processing node will save these coordinates in a *.txt* per route. When coordinates do not change for around 30 minutes the file stream will be finally closed and next coordinates will be saved in a new file. File names correspond to the date it was created in the next format: *YYYY/MM/DD-hhmm*