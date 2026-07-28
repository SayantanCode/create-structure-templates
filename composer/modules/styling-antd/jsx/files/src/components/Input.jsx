import AntInput from "antd/es/input";

// Plain antd Input renders type="password" correctly at the HTML level; it
// just skips the fancier show/hide-eye-icon toggle that Input.Password adds
// on top — fine for a generic wrapper that has to support any input type.
export function Input(props) {
  return <AntInput {...props} />;
}
