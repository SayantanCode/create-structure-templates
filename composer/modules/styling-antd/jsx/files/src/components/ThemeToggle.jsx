import Segmented from "antd/es/segmented";
import { BulbOutlined, BulbFilled, DesktopOutlined } from "@ant-design/icons";
import { useTheme } from "../theme/ThemeContext";

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <Segmented
      value={mode}
      onChange={(value) => setMode(value)}
      options={[
        { value: "light", icon: <BulbOutlined /> },
        { value: "dark", icon: <BulbFilled /> },
        { value: "system", icon: <DesktopOutlined /> },
      ]}
      style={{ position: "fixed", top: 16, right: 16, zIndex: 100 }}
    />
  );
}
