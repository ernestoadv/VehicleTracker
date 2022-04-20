# Tracker

This is the website displaying the GPS information and measurements based on Node.js. Provides a simple UI that displays all the previous information per route.

## Usage

Run **npm install** on this folder, add a _.env_ file with the lines below and then run the command **npm start**. That should launch a _localhost:3000_ tab on your Chrome browser. If you do not have Chrome try opening that same site on another browser. Nevertheless, Chrome adoption is encouraged.

```
  GOOGLE_MAPS_API_KEY=your_api_key
  ROADS_API=https://roads.googleapis.com/v1/snapToRoads
```

## Requirements

- Node.js >= 12
- Chrome if possible
