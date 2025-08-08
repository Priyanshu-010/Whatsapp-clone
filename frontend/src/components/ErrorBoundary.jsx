import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.log(error)
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-center p-4 text-red-500">Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;