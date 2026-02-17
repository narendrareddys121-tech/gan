
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { LucideAlertTriangle, LucideRefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F1419] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="flex justify-center">
              <div className="p-6 bg-red-500/10 rounded-full">
                <LucideAlertTriangle size={48} className="text-red-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-sm opacity-60 leading-relaxed">
                We encountered an unexpected error. This has been logged and we'll look into it.
              </p>
              
              {this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-xs opacity-40 hover:opacity-60 transition-opacity">
                    Technical Details
                  </summary>
                  <div className="mt-3 p-4 bg-white/5 rounded-2xl text-xs font-mono overflow-auto max-h-40">
                    <p className="text-red-400 font-bold mb-2">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="opacity-60 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>
            
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={this.handleRetry}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <LucideRefreshCcw size={18} />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
