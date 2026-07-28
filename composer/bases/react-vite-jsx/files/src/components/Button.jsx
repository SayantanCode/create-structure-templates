export function Button({ className = "", ...props }) {
  return <button className={`btn ${className}`.trim()} {...props} />;
}
