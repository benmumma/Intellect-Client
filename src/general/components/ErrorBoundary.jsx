import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        if (error.message.includes('ResizeObserver')) {
            return { hasError: false }; // Do not update state if it's the specific error
        }
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        if (!error.message.includes('ResizeObserver')) {
            console.error("Error caught in ErrorBoundary:", error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
