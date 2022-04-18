import { memo } from "react";
import ReactToggle from "react-toggle";
import "../style/toggle.css";

function Toggle(props) {
  const { defaultChecked, name, onChange } = props;
  return (
    <>
      <ReactToggle defaultChecked={defaultChecked} onChange={onChange} />
      <span className={"react-toggle-name"}>{name}</span>
    </>
  );
}

export default memo(Toggle);
