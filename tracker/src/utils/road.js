const API_BASE_URL = "https://roads.googleapis.com/v1/snapToRoads";
const KEY = "AIzaSyCZgE5vU4EUwC3vqakIV4SPwJ79JcDYmX4";

function chunkArray(array, size) {
  let chunks = [];
  for (let index = 0; index < array?.length; index += size) {
    const chunk = array.slice(index, index + size);
    chunks.push(chunk);
  }
  return chunks;
}

// Store snapped polyline returned by the snap-to-road service
function parseResponse(data) {
  let road = [];
  for (var i = 0; i < data.snappedPoints.length; i++) {
    road.push({
      lat: data.snappedPoints[i].location.latitude,
      lng: data.snappedPoints[i].location.longitude,
    });
  }
  return road;
}

function requestChunk(coordinates) {
  const request = new XMLHttpRequest();
  const url =
    API_BASE_URL +
    "?path=" +
    coordinates.join("|") +
    "&interpolate=true" +
    "&key=" +
    KEY;
  request.open("GET", url, false);
  request.send(null);
  const response = JSON.parse(request?.responseText);
  const road = parseResponse(response);
  return road;
}

// Snap a to roads and return the Road service response
function fetchRoad(data) {
  if (!data) return;
  let coordinates = [];
  let road = {};

  data.forEach((coordinate) => {
    coordinates.push(coordinate?.lat + "," + coordinate?.lng);
  });
  const chunks = chunkArray(coordinates, 100);
  chunks.forEach((chunk) => {
    const data = requestChunk(chunk);
    road = { data, ...road };
  });
  return road;
}

export { fetchRoad };
