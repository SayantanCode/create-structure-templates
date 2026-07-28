import AntButton from "antd/es/button";

// antd's own `type` prop means style variant ("primary"/"default"/...), not
// the native HTML button type — so our `type` (submit/button/reset) has to
// be renamed to antd's `htmlType` instead, or it'd silently do nothing.
export function Button({ children, type, ...props }) {
  return (
    <AntButton type="primary" htmlType={type} {...props}>
      {children}
    </AntButton>
  );
}
