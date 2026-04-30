'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-48 gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Interface Error</h3>
          </div>
          <p className="text-[10px] text-red-400/60 font-mono text-center max-w-[200px] truncate">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Retry System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
