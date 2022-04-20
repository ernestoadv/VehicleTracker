# VehicleTracker

Vehicle tracker based on Python and Node.js. Provides a vehicle real-time location, storaged routes and different measurements such as speed or distance traveled.

## Usage

Each folder contains a functionality described below:

- **gps**: *Data reception and delivery*. These files are run on two different nodes, one for GPS data reception and other for GPS data processing.
- **measurements**: *Data processing*. These files are run on one only node and retrieves data such as speed, distance and time from the route.
- **tracker**: *Data display*. The server is run on a machine which receives data from the data processing node and displays it on a map.