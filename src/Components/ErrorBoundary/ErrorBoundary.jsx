import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "20px",
          textAlign: "center",
          color: "#fff",
          background: "#000",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <h2>⚠️ Oops! Something went wrong</h2>
          <p style={{ marginTop: "10px", color: "#ccc" }}>{this.state.error?.message}</p>
          <button
            onClick={() => window.location.href = "/"}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#e50914",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;