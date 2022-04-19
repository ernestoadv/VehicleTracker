import { memo, useEffect, useState } from "react";
import Select from "react-select";

function Routes(props) {
  const [current, setCurrent] = useState(null);
  const [routes, setRoutes] = useState([]);

  const fetchRoutes = (routes) => {
    let allRoutes = [];

    if (!routes) return;

    routes = routes.sort((a, b) => b.localeCompare(a));

    // Populate routes array
    routes.forEach((route) => {
      const name = route.split(".")[0];
      const option = {
        value: route,
        label: name === "current" ? "Current route" : name,
      };
      if (!allRoutes.includes(option)) {
        allRoutes.push(option);
      }
    });

    return allRoutes;
  };

  useEffect(() => {
    const { routes } = props;
    setRoutes(fetchRoutes(routes));
  }, [props.routes]);

  useEffect(() => {
    const { routes } = props;
    setRoutes(fetchRoutes(routes));
  }, []);

  const onChange = (option) => {
    const { onChange } = props;
    onChange(option?.value);
    setCurrent(option);
  };

  return (
    <div className="routes">
      <Select onChange={onChange} options={routes} value={current} />
    </div>
  );
}

export default memo(Routes);
