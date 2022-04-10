import {
  GoogleMap,
  Polyline,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api"; // DOC: https://react-google-maps-api-docs.netlify.app/
import { useCallback, useEffect, useState } from "react";
import { fetchRoad } from "../utils/road.js";
import EndIcon from "../../media/end.png";

const DEFAULT_CENTER = {
  lat: 40.45319339070344,
  lng: -3.7336413128108963,
};
const OPTIONS = {
  disableDefaultUI: true,
  fullscreenControl: true,
  fullscreenControlOptions: {
    position: 6.0,
  },
};
const POLYLINE = {
  strokeColor: "#4285F4",
  strokeOpacity: 1,
  strokeWeight: 3,
  fillColor: "#4285F4",
  fillOpacity: 1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1,
};
const ZOOM_VALUE = 16;

function Map(props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  });
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [end, setEnd] = useState(null);
  const [init, setInit] = useState(null);
  const [map, setMap] = useState(null);
  const [road, setRoad] = useState(null);

  const onCenter = useCallback(
    function callback() {
      if (!map) return;
      const currentCenter = map?.getCenter();
      const currentLat = currentCenter.lat();
      const currentLng = currentCenter.lng();
      const { lat: newLat, lng: newLng } = center;
      if (currentLat !== newLat && currentLng !== newLng) {
        map?.setCenter(center);
      }
    },
    [center, map]
  );

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    const { route } = props;
    if (route?.coordinates) {
      const { coordinates } = route;
      if (coordinates?.length > 0) {
        const road = fetchRoad(coordinates)?.data;
        const { lat, lng } = road[0];
        setCenter({
          lat: lat - 0.004,
          lng,
        });
        setInit(road[0]);
        setEnd(road[road.length - 1]);
        setRoad(road);
        map?.setZoom(ZOOM_VALUE);
      }
    }
  }, [props.route]);

  return (
    <div className="map">
      {isLoaded ? (
        <GoogleMap
          center={center}
          ignoreHidden={true}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          options={OPTIONS}
          onCenterChanged={onCenter}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {road && (
            <>
              <Marker position={init}></Marker>
              <Marker position={end} icon={EndIcon}></Marker>
              <Polyline path={road} options={POLYLINE} />
            </>
          )}
        </GoogleMap>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Map;
