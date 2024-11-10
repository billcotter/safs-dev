// src/middleware/rate-limit.ts
import rateLimit from 'express-rate-limit';
import type { APIRoute } from 'astro';

export function createRateLimiter(
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100 // limit each IP to 100 requests per windowMs
) {
  const limiter = rateLimit({
    windowMs,
    max,
    message: 'Too many requests, please try again later.',
  });

  return async function rateLimitMiddleware(context: APIRoute) {
    return new Promise((resolve, reject) => {
      limiter(context.request as any, context.response as any, (error: any) => {
        if (error) reject(error);
        else resolve();
      });
    });
  };
}

// src/utils/errors/api-error.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// src/utils/errors/error-handler.ts
export function errorHandler(error: unknown) {
  if (error instanceof APIError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  console.error('Unhandled error:', error);
  return new Response(
    JSON.stringify({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
