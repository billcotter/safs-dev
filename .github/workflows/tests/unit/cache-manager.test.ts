// tests/unit/cache-manager.test.ts
import { describe, it, expect, vi } from 'vitest';
import { cacheManager } from '../../src/lib/cache/cache-manager';

describe('CacheManager', () => {
  it('should cache and retrieve values', async () => {
    const key = 'test-key';
    const value = { data: 'test-value' };

    await cacheManager.set(key, value);
    const cached = await cacheManager.get(key);

    expect(cached).toEqual(value);
  });

  it('should handle cache misses', async () => {
    const key = 'non-existent';
    const cached = await cacheManager.get(key);

    expect(cached).toBeUndefined();
  });
});

// tests/integration/api-integration.test.ts
import { describe, it, expect } from 'vitest';
import { apiCache } from '../../src/lib/cache/api-cache';

describe('API Integration', () => {
  it('should fetch and cache OMDB data', async () => {
    const imdbId = 'tt0111161'; // The Shawshank Redemption

    const data = await apiCache.fetchOMDB(imdbId);
    expect(data).toBeDefined();
    expect(data.Title).toBeDefined();

    // Should return cached data on second call
    const cached = await apiCache.fetchOMDB(imdbId);
    expect(cached).toEqual(data);
  });
});

// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test('basic navigation', async ({ page }) => {
  await page.goto('/');

  // Check homepage
  await expect(page).toHaveTitle(/St. Augustine Film Society/);

  // Navigate to films
  await page.click('text=Films');
  await expect(page).toHaveURL(/.*\/films/);

  // Check film details
  await page.click('text=The Shawshank Redemption');
  await expect(page.locator('h1')).toContainText('The Shawshank Redemption');
});
