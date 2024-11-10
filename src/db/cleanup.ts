// src/lib/db/cleanup.ts
import { db } from 'astro:db';
import {
  MovieComments,
  MovieRatings,
  ViewCounts,
  Users,
} from '../../db/schema';

export async function cleanupOrphanedData() {
  // Delete comments for non-existent movies
  await db
    .delete(MovieComments)
    .where(
      `NOT EXISTS (SELECT 1 FROM films WHERE films.imdbID = MovieComments.movieId)`
    );

  // Delete ratings for non-existent movies
  await db
    .delete(MovieRatings)
    .where(
      `NOT EXISTS (SELECT 1 FROM films WHERE films.imdbID = MovieRatings.movieId)`
    );

  // Delete view counts for non-existent movies
  await db
    .delete(ViewCounts)
    .where(
      `NOT EXISTS (SELECT 1 FROM films WHERE films.imdbID = ViewCounts.movieId)`
    );

  // Delete user preferences for deleted users
  await db
    .delete('UserPreferences')
    .where(
      `NOT EXISTS (SELECT 1 FROM Users WHERE Users.id = UserPreferences.userId)`
    );
}

// src/lib/db/duplicate-prevention.ts
export async function preventDuplicates(imdbId: string) {
  const existing = await db.select().from('films').where({ imdbID: imdbId });
  if (existing.length > 0) {
    throw new APIError(
      'Movie already exists in database',
      409,
      'DUPLICATE_ENTRY'
    );
  }
}

// Example usage in an API route
// src/pages/api/movies/add.ts
import { preventDuplicates } from '../../../lib/db/duplicate-prevention';
import { errorHandler } from '../../../utils/errors/error-handler';
import { createRateLimiter } from '../../../middleware/rate-limit';

const rateLimiter = createRateLimiter(60 * 1000, 10); // 10 requests per minute

export async function POST({ request }: APIRoute) {
  try {
    // Apply rate limiting
    await rateLimiter(request);

    const { imdbId } = await request.json();

    // Check for duplicates
    await preventDuplicates(imdbId);

    // Proceed with adding the movie...

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return errorHandler(error);
  }
}
