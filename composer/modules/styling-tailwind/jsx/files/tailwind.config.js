/** @type {import('tailwindcss').Config} */
export default {
  // Class-based (not media-query-based) so ThemeContext's own light/dark/
  // system logic — not just the OS preference — controls Tailwind's own
  // `dark:` utilities too.
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
