import "./App.css";
// __COMPOSER_IMPORTS__

function App() {
  return (
    <>
      {/* __COMPOSER_PROVIDERS_OPEN__ */}
      <div className="app">
        <h1>{{projectName}}</h1>
        <p>Composed with create-structure.</p>
        {/* __COMPOSER_CONTENT__ */}
      </div>
      {/* __COMPOSER_PROVIDERS_CLOSE__ */}
    </>
  );
}

export default App;
