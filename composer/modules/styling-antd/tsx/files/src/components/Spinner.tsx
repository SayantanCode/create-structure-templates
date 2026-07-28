import AntSpin from "antd/es/spin";

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <span role="status" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <AntSpin size="small" />
      <span>{label}</span>
    </span>
  );
}
