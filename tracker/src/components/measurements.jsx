import { memo, useEffect, useState } from "react";

function Measurements(props) {
  const [distance, setDistance] = useState({
    totalDistance: null,
  });
  const [time, setTime] = useState({
    totalTime: null,
    movingTime: null,
    stoppedTime: null,
  });
  const [speed, setSpeed] = useState({
    averageSpeed: null,
    maxSpeed: null,
    movingSpeed: null,
  });

  useEffect(() => {
    const { route } = props;

    if (!route) return;

    const { distance, time, speed } = route;

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
        value: Math.round(speed?.average?.value * 1000) / 1000 || "-",
        unit: speed?.average?.unit || "-",
      },
      maxSpeed: {
        value: Math.round(speed?.max?.value * 1000) / 1000 || "-",
        unit: speed?.max?.unit || "-",
      },
      movingSpeed: {
        value: Math.round(speed?.moving?.value * 1000) / 1000 || "-",
        unit: speed?.moving?.unit || "-",
      },
    });
  }, [props.route]);

  const { totalDistance } = distance;
  const { totalTime, movingTime, stoppedTime } = time;
  const { averageSpeed, maxSpeed, movingSpeed } = speed;

  return (
    (totalDistance ||
      totalTime ||
      movingTime ||
      stoppedTime ||
      averageSpeed ||
      maxSpeed ||
      movingSpeed) && (
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
              Average: <label>{averageSpeed?.value} </label>{" "}
              {averageSpeed?.unit}
            </span>
            {/* <span>
              Max: <label>{maxSpeed?.value} </label> {maxSpeed?.unit}
            </span> */}
            <span>
              Moving: <label>{movingSpeed?.value} </label> {movingSpeed?.unit}
            </span>
          </div>
        </div>
      </div>
    )
  );
}

export default memo(Measurements);
