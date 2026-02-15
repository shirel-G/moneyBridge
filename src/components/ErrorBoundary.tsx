import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary — catches unhandled errors in the component tree.
 * 
 * Security considerations:
 * - Never exposes stack traces to users
 * - Logs sanitized error info
 * - Provides a safe recovery option
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error securely — never expose to user
        console.error('[ErrorBoundary] Caught error:', {
            message: error.message,
            // Sanitize: don't log full stack in production
            component: errorInfo.componentStack?.substring(0, 200),
            timestamp: new Date().toISOString(),
        });

        // In production, this would send to an error tracking service
        // like Sentry, but with PII stripped
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                    <div className="max-w-sm w-full text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">שגיאה לא צפויה</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            אירעה שגיאה. המידע שלך בטוח. אנא נסה שוב.
                        </p>
                        <button
                            onClick={() => {
                                this.handleReset();
                                window.location.reload();
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            נסה שוב
                        </button>
                        <p className="text-xs text-gray-400 mt-4">
                            אם הבעיה חוזרת, צור קשר עם התמיכה
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
