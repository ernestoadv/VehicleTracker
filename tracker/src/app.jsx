import { memo, useEffect, useState } from "react";
import Map from "./components/map";
import Measurements from "./components/measurements";
import Routes from "./components/routes";
import "./app.css";

const RECORDS_INTERVAL = 10;

function App() {
  const [records, setRecords] = useState(null);
  const [route, setRoute] = useState(null);

  const onChange = (route) => {
    setRoute(route);
  };

  const onFetch = () => {
    new Promise((resolve) => {
      const data = import("../data/records.json");
      resolve(data);
    }).then((data) => {
      setRecords((prev) => {
        return prev?.routes !== data?.routes ? data : prev;
      });
    });
  };

  useEffect(() => {
    onFetch();
    const fetchRecords = setInterval(() => {
      onFetch();
    }, RECORDS_INTERVAL * 1000);
    return () => {
      clearInterval(fetchRecords);
    };
  }, []);

  return (
    <>
      <Map route={route}></Map>
      <Routes routes={records?.routes} onChange={onChange}></Routes>
      <Measurements route={route}></Measurements>
    </>
  );
}

export default memo(App);
