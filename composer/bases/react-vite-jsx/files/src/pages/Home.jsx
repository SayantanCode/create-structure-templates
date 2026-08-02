import { useState } from "react";
import { Button, Input, Modal, Spinner } from "@/components";
// __COMPOSER_IMPORTS__

export function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="page">
      <div className="hero">
        <span className="badge">⚡ Built with create-structure</span>
        <h1 className="gradient-text">{{projectName}}</h1>
        <p className="subtitle">
          Composed from the pieces you picked when scaffolding — swap any of them any time.
        </p>
      </div>

      <section className="showcase-grid">
        <div className="demo-card">
          <h2>Buttons</h2>
          <div className="demo-card-row">
            <Button>Primary</Button>
            <Button disabled>Disabled</Button>
            <Spinner />
          </div>
        </div>

        <div className="demo-card">
          <h2>Input</h2>
          <Input placeholder="Try typing here..." />
        </div>

        <div className="demo-card">
          <h2>Modal</h2>
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <h3>Hello from Modal</h3>
            <p>This is the same Modal component used everywhere else in the app.</p>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </Modal>
        </div>

        {/* __COMPOSER_CONTENT__ */}
      </section>
    </div>
  );
}
