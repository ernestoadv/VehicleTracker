import { memo, useEffect, useState } from "react";
import Map from "./components/map";
import Measurements from "./components/measurements";
import Routes from "./components/routes";
import Toggle from "./components/toggle";
import "./style/app.css";

const UPDATE_ROUTE_INTERVAL = 3;
const UPDATE_RECORDS_INTERVAL = 10;
const USE_API_BY_DEFAULT = false;

function App() {
  const [api, setApi] = useState(USE_API_BY_DEFAULT);
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState(null);
  const [route, setRoute] = useState(null);

  const onChangeRoute = (file) => {
    new Promise((resolve) => {
      const data = import("../data/" + file);
      resolve(data);
    }).then((data) => {
      setFile(file);
      setRoute(data);
    });
  };

  const onFetchRecords = () => {
    new Promise((resolve) => {
      const data = import("../data/records.json");
      resolve(data);
    }).then((data) => {
      setRecords((prev) => {
        return prev?.routes !== data?.routes ? data : prev;
      });
    });
  };

  const onEnableApi = (event) => {
    setApi(event?.target.checked ?? false);
  };

  useEffect(() => {
    const fetchRoute = setInterval(() => {
      if (file === "current.json" || route?.current) {
        onChangeRoute(file);
      }
    }, UPDATE_ROUTE_INTERVAL * 1000);
    return () => {
      clearInterval(fetchRoute);
    };
  }, [file, route]);

  useEffect(() => {
    onFetchRecords();
    const fetchRecords = setInterval(() => {
      onFetchRecords();
    }, UPDATE_RECORDS_INTERVAL * 1000);
    return () => {
      clearInterval(fetchRecords);
    };
  }, []);

  return (
    <>
      <Map api={api} route={route}></Map>
      <Measurements route={route}></Measurements>
      <Routes routes={records?.routes} onChange={onChangeRoute}></Routes>
      <Toggle
        defaultChecked={USE_API_BY_DEFAULT}
        name={"API"}
        onChange={onEnableApi}
      ></Toggle>
    </>
  );
}

export default memo(App);
