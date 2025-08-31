'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const reset = () => {
        this.setState({ hasError: false, error: null })
      }

      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error!} reset={reset} />
      }

      return <DefaultErrorFallback error={this.state.error!} reset={reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-destructive" size={32} />
        </div>
        <CardTitle className="text-xl">Something went wrong</CardTitle>
        <CardDescription>
          We encountered an error while loading this page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <details className="text-left">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            Error details
          </summary>
          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
        
        <Button onClick={reset} className="flex items-center gap-2">
          <RefreshCw size={16} />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}

export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
) {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}