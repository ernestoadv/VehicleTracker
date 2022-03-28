import { useEffect, useState } from "react";
import { Client } from "@googlemaps/google-maps-services-js";

function Map(props) {
  useEffect(() => {
    console.log("Map useEffect");
  }, []);

  return <div>MAPA</div>;
}

export default Map;
