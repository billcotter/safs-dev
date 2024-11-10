// src/db/schema.ts
import { defineTable, column, relations } from 'astro:db';

// User preferences and interactions
export const Users = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    email: column.text({ unique: true }),
    name: column.text(),
    createdAt: column.date({ default: new Date() }),
    lastLogin: column.date(),
  },
});

export const UserPreferences = defineTable({
  columns: {
    userId: column.text({ references: () => Users.columns.id }),
    preferredGenres: column.json(), // Array of genre IDs
    preferredLanguages: column.json(), // Array of language codes
    notifications: column.boolean({ default: true }),
  },
});

export const MovieComments = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    movieId: column.text(), // References imdbID
    userId: column.text({ references: () => Users.columns.id }),
    content: column.text(),
    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date(),
  },
});

export const MovieRatings = defineTable({
  columns: {
    movieId: column.text(), // References imdbID
    userId: column.text({ references: () => Users.columns.id }),
    rating: column.number({ min: 1, max: 5 }),
    createdAt: column.date({ default: new Date() }),
  },
});

export const ViewCounts = defineTable({
  columns: {
    movieId: column.text(), // References imdbID
    views: column.number({ default: 0 }),
    lastUpdated: column.date(),
  },
});
