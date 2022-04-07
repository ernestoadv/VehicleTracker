import { memo, useEffect, useState } from "react";
import Select from "react-select";

function Routes(props) {
  const [allRoutes, setAllRoutes] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(null);

  const fetchRoutes = (routes) => {
    let allRoutes = [];

    if (!routes) return;

    // Populate routes array
    routes.forEach((route) => {
      const name = route.split(".")[0];
      const option = {
        value: route,
        label: name,
      };
      if (!allRoutes.includes(option)) {
        allRoutes.push(option);
      }
    });

    return allRoutes;
  };

  useEffect(() => {
    const { routes } = props;
    setAllRoutes(fetchRoutes(routes));
  }, [props.routes]);

  useEffect(() => {
    const { routes } = props;
    setAllRoutes(fetchRoutes(routes));
  }, []);

  const onChange = (option) => {
    const { onChange } = props;
    onChange(option?.value);
    setCurrentRoute(option);
  };

  return (
    <div className="routes">
      <Select
        value={currentRoute}
        options={allRoutes}
        className={"routes-select"}
        onChange={onChange}
      />
    </div>
  );
}

export default memo(Routes);
