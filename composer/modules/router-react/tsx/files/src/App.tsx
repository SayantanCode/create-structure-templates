import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/theme/ThemeContext";
import { Navbar } from "@/components";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import "@/App.css";
// __COMPOSER_IMPORTS__

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        {/* __COMPOSER_PROVIDERS_OPEN__ */}
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {/* __COMPOSER_PROVIDERS_CLOSE__ */}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
