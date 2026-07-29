export function Spinner({ label = "Loading..." }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
      role="status"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400" />
      {label}
    </span>
  );
}
