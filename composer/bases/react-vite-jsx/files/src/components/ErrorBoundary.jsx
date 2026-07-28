import { Component } from "react";

// Catches render-time errors anywhere below it in the tree and shows a
// fallback instead of a blank white screen. Logs the real error to the
// console; wire up real error reporting (Sentry etc.) in componentDidCatch
// for production.
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
