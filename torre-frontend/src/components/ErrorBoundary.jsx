import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      error,
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[UI ERROR]', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      error: null,
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return this.props.renderFallback({
        error: this.state.error,
        reset: this.reset,
      });
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
