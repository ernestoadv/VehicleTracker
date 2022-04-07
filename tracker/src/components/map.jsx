import { useCallback, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
// https://react-google-maps-api-docs.netlify.app/

function Map(props) {
  const [map, setMap] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDXS066ulPrsCPu1BfEf-zaY6xLFVqxvD0",
  });

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    console.log(bounds);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div className="map">
      {isLoaded ? (
        <GoogleMap
          center={{
            lat: -3.624004,
            lng: 37.14877,
          }}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
          zoom={15}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <></>
        </GoogleMap>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Map;
