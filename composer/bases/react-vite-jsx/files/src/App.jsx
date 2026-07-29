import { useState } from "react";
import { ThemeProvider } from "./theme/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Modal } from "./components/Modal";
import { Spinner } from "./components/Spinner";
import "./App.css";
// __COMPOSER_IMPORTS__

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <ThemeToggle />
      {/* __COMPOSER_PROVIDERS_OPEN__ */}
      <div className="app">
        <div className="hero">
          <span className="badge">⚡ Built with create-structure</span>
          <h1 className="gradient-text">{{projectName}}</h1>
          <p className="subtitle">Composed from the pieces you picked when scaffolding — swap any of them any time.</p>
        </div>

        <section className="showcase">
          <h2>Component showcase</h2>
          <div className="showcase-row">
            <Button>Primary</Button>
            <Button disabled>Disabled</Button>
            <Spinner />
          </div>
          <Input placeholder="Try typing here..." />
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <h3>Hello from Modal</h3>
            <p>This is the same Modal component used everywhere else in the app.</p>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </Modal>
        </section>

        <section className="showcase demo">
          {/* __COMPOSER_CONTENT__ */}
        </section>
      </div>
      {/* __COMPOSER_PROVIDERS_CLOSE__ */}
    </ThemeProvider>
  );
}

export default App;
