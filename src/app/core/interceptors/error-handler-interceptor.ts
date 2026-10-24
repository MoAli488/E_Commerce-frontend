import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

/**
 * Extracts a human-readable error message from an HttpErrorResponse.
 */
function extractErrorMessage(error: HttpErrorResponse): string {
  // Client-side or Network Error
  if (error.error instanceof ErrorEvent) {
    return error.error.message || 'A client-side network error occurred.';
  }

  // Network offline / unreachable / CORS
  if (error.status === 0) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Server returned an explicit error string
  if (typeof error.error === 'string') {
    return error.error;
  }

  // Server returned an error object/message
  if (error.error && typeof error.error === 'object') {
    if (typeof error.error.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }
    if (typeof error.error.error === 'string' && error.error.error.trim()) {
      return error.error.error;
    }
    if (Array.isArray(error.error.errors) && error.error.errors.length > 0) {
      return error.error.errors
        .map((e: unknown) => (typeof e === 'string' ? e : JSON.stringify(e)))
        .join(', ');
    }
  }

  // Standard status code fallback messages
  switch (error.status) {
    case 400:
      return 'Bad request. Please verify the submitted data.';
    case 401:
      return 'Session expired or unauthorized. Please sign in again.';
    case 403:
      return 'Access denied. You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred with the current state of the resource.';
    case 422:
      return 'Validation failed. Please verify your input.';
    case 429:
      return 'Too many requests. Please slow down and try again later.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
      return 'Bad gateway. The server received an invalid response.';
    case 503:
      return 'Service unavailable. The server is temporarily overloaded or down for maintenance.';
    case 504:
      return 'Gateway timeout. The server took too long to respond.';
    default:
      return (
        error.statusText || 'An unexpected error occurred. Please try again.'
      );
  }
}

/**
 * Global HTTP Error Handler Interceptor.
 * Intercepts all failed HTTP requests, logs diagnostic info, manages authentication/authorization
 * redirects, provides user-friendly notifications, and forwards the error for local handling.
 */
export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService, { optional: true });

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const errorMessage = extractErrorMessage(error);
        alert(errorMessage);

        // Structured diagnostic logging
        console.error(
          `[HTTP Error] ${req.method} "${req.urlWithParams}" [${error.status} ${error.statusText || ''}]: ${errorMessage}`,
          error,
        );

        switch (error.status) {
          case 0: {
            console.warn('Network connection failure: Server is unreachable.');
            break;
          }
          case 401: {
            // Unauthorized / Token expired: clear credentials and navigate to login
            if (authService) {
              authService.logout();
            } else {
              localStorage.removeItem('token');
            }

            if (router) {
              const currentUrl = router.url;
              if (!currentUrl.includes('/login')) {
                router.navigate(['/login'], {
                  queryParams:
                    currentUrl && currentUrl !== '/'
                      ? { returnUrl: currentUrl }
                      : undefined,
                });
              }
            }
            break;
          }
          case 403: {
            // Access denied / Forbidden
            console.warn(`[403 Forbidden] Access denied for URL: ${req.url}`);
            if (router && !router.url.includes('/login')) {
              router.navigate(['/']);
            }
            break;
          }
          case 404: {
            // Not Found
            console.warn(`[404 Not Found] Resource not found: ${req.url}`);
            // if (router) {
            //   router.navigate(['/not-found']);
            // }
            break;
          }
          case 500:
          case 502:
          case 503:
          case 504: {
            // Server-side errors: alert or notify the user gracefully
            if (
              typeof window !== 'undefined' &&
              typeof window.alert === 'function'
            ) {
              alert(errorMessage);
            }
            break;
          }
          default:
            break;
        }

        // Attach friendly message to the error object for downstream subscribers
        (error as any).friendlyMessage = errorMessage;
      } else {
        console.error('[HTTP Unknown Error]', error);
      }

      return throwError(() => error);
    }),
  );
};
