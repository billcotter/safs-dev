// src/content/config.ts
import { defineCollection, reference, z } from 'astro:content';

// Base schemas for shared properties
const ratingSchema = z.object({
  Source: z.string(),
  Value: z.string(),
});

const baseMovieFields = {
  title: z.string(),
  year: z.number(),
  imdbID: z.string().optional(),
  rated: z.string(),
  released: z.string().transform((str) => new Date(str)),
  runtime: z.string(),
  plot: z.string(),
  language: z.string(),
  country: z.string(),
  awards: z.string().optional(),
  poster: z.string().url().optional(),
  ratings: z.array(ratingSchema).optional(),
  metascore: z.string().optional(),
  imdbRating: z.string().optional(),
  imdbVotes: z.string().optional(),
  dvd: z.string().optional(),
  boxOffice: z.string().optional(),
  production: z.string().optional(),
  website: z.string().url().optional(),
  // TMDB specific fields
  tagline: z.string().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  original_title: z.string().optional(),
};

// Define collections
export const collections = {
  films: defineCollection({
    type: 'data',
    schema: z.object({
      ...baseMovieFields,
      // References to related content
      director: reference('directors'),
      writers: z.array(reference('writers')),
      actors: z.array(reference('actors')),
      genres: z.array(reference('genres')),
    }),
  }),

  directors: defineCollection({
    type: 'data',
    schema: z.object({
      name: z.string(),
      bio: z.string().optional(),
      birthDate: z.string().optional(),
      nationality: z.string().optional(),
      imageUrl: z.string().url().optional(),
    }),
  }),

  actors: defineCollection({
    type: 'data',
    schema: z.object({
      name: z.string(),
      bio: z.string().optional(),
      birthDate: z.string().optional(),
      nationality: z.string().optional(),
      imageUrl: z.string().url().optional(),
    }),
  }),

  writers: defineCollection({
    type: 'data',
    schema: z.object({
      name: z.string(),
      bio: z.string().optional(),
      birthDate: z.string().optional(),
      nationality: z.string().optional(),
    }),
  }),

  genres: defineCollection({
    type: 'data',
    schema: z.object({
      name: z.string(),
      description: z.string().optional(),
    }),
  }),
};
