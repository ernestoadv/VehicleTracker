# VehicleTracker

Vehicle tracker based on Python and Node.js. Provides a vehicle real-time location, storaged routes and different measurements such as speed or distance traveled.

## Usage

Once cloned, run **npm install** on the folder named *tracker*, add a *.env* file with the below lines and then run the command **npm start**. That should launch a *localhost:3000* tab on your Chrome browser. If you do not have Chrome try opening that same site on another browser. Nevertheless, Chrome adoption is encouraged.

```
  GOOGLE_MAPS_API_KEY=your_api_key
  ROADS_API=https://roads.googleapis.com/v1/snapToRoads
```

## Requirements

- Node.js >= 12
- Python >= 3.9
- Chrome if possible
