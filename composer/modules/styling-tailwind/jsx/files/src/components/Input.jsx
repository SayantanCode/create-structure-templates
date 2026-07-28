export function Input({ className = "", ...props }) {
  return (
    <input
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`.trim()}
      {...props}
    />
  );
}
