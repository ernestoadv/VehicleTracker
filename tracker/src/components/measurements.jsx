import { memo, useEffect, useState } from "react";

function Measurements(props) {
  const [distance, setDistance] = useState({
    totalDistance: {
      value: "-",
      unit: "km",
    },
  });
  const [time, setTime] = useState({
    totalTime: {
      value: "-",
      unit: "hh/mm/ss",
    },
    movingTime: {
      value: "-",
      unit: "hh/mm/ss",
    },
    stoppedTime: {
      value: "-",
      unit: "hh/mm/ss",
    },
  });
  const [speed, setSpeed] = useState({
    averageSpeed: {
      value: "-",
      unit: "km/h",
    },
    maxSpeed: {
      value: "-",
      unit: "km/h",
    },
    movingSpeed: {
      value: "-",
      unit: "km/h",
    },
  });

  useEffect(() => {
    const { route } = props;

    if (!route) return;

    new Promise((resolve) => {
      const data = import("../../data/" + route);
      resolve(data);
    }).then((data) => {
      const { distance, time, speed } = data;
      setDistance({
        totalDistance: {
          value: Math.round(distance?.value * 1000) / 1000 || "-",
          unit: distance?.unit || "-",
        },
      });
      setTime({
        totalTime: {
          value: time?.total?.value || "-",
          unit: time?.total?.unit || "-",
        },
        movingTime: {
          value: time?.moving?.value || "-",
          unit: time?.moving?.unit || "-",
        },
        stoppedTime: {
          value: time?.stopped?.value || "-",
          unit: time?.stopped?.unit || "-",
        },
      });
      setSpeed({
        averageSpeed: {
          value: speed?.average?.value || "-",
          unit: speed?.average?.unit || "-",
        },
        maxSpeed: {
          value: speed?.max?.value || "-",
          unit: speed?.max?.unit || "-",
        },
        movingSpeed: {
          value: speed?.moving?.value || "-",
          unit: speed?.moving?.unit || "-",
        },
      });
    });
  }, [props.route]);

  const { totalDistance } = distance;
  const { totalTime, movingTime, stoppedTime } = time;
  const { averageSpeed, maxSpeed, movingSpeed } = speed;

  return (
    <div className="measurements">
      <div className="distance">
        <div className="measurement-header">Distance</div>
        <div className="measurement-content">
          <span>
            Total: <label>{totalDistance?.value}</label> {totalDistance?.unit}
          </span>
        </div>
      </div>
      <div className="time">
        <div className="measurement-header">Time</div>
        <div className="measurement-content">
          <span>
            Total: <label>{totalTime?.value}</label> {totalTime?.unit}
          </span>
          <span>
            Moving: <label>{movingTime?.value}</label> {movingTime?.unit}
          </span>
          <span>
            Stopped: <label>{stoppedTime?.value} </label> {stoppedTime?.unit}
          </span>
        </div>
      </div>
      <div className="speed">
        <div className="measurement-header">Speed</div>
        <div className="measurement-content">
          <span>
            Average: <label>{averageSpeed?.value} </label> {averageSpeed?.unit}
          </span>
          <span>
            Max: <label>{maxSpeed?.value} </label> {maxSpeed?.unit}
          </span>
          <span>
            Moving: <label>{movingSpeed?.value} </label> {movingSpeed?.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(Measurements);
