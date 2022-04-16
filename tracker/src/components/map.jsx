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

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const fetchCenter = useCallback(function callback(road) {
    let maxLat = -999;
    let minLat = 999;
    let maxLng = -999;
    let minLng = 999;
    road.forEach((coordinate) => {
      // Get min and max lat
      if (coordinate.lat > maxLat) maxLat = coordinate.lat;
      if (coordinate.lat < minLat) minLat = coordinate.lat;
      // Get min and max lng
      if (coordinate.lng > maxLng) maxLng = coordinate.lng;
      if (coordinate.lng < minLng) minLng = coordinate.lng;
    });
    return { lat: (maxLat + minLat) / 2 - 0.001, lng: (maxLng + minLng) / 2 };
  }, []);

  const fetchMarkers = useCallback(
    function callback() {
      let key = 0;
      return road.map((marker, index) => {
        if (index % 8 !== 0) return;
        if ([init, end].includes(marker)) return;
        key += 1;
        return (
          <Marker
            key={key}
            label={{
              border: "solid 1px",
              color: "#FFF",
              fontSize: "12px",
              fontWeight: "1200",
              text: key.toString(),
            }}
            position={marker}
          ></Marker>
        );
      });
    },
    [end, init, road]
  );

  useEffect(() => {
    const { route } = props;
    if (route?.coordinates) {
      const { coordinates } = route;
      if (coordinates?.length > 0) {
        const road = fetchRoad(coordinates)?.data;
        const center = fetchCenter(road);
        const init = road[0];
        const end = road[road.length - 1];
        setCenter(center);
        setInit(init);
        setEnd(end);
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
              {fetchMarkers()}
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
