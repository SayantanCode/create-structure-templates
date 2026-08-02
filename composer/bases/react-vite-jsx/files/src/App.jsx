import { ThemeProvider } from "@/theme/ThemeContext";
import { Navbar } from "@/components";
import { Home } from "@/pages/Home";
import "@/App.css";
// __COMPOSER_IMPORTS__

function App() {
  return (
    <ThemeProvider>
      <Navbar />
      {/* __COMPOSER_PROVIDERS_OPEN__ */}
      <div className="app">
        <Home />
      </div>
      {/* __COMPOSER_PROVIDERS_CLOSE__ */}
    </ThemeProvider>
  );
}

export default App;
