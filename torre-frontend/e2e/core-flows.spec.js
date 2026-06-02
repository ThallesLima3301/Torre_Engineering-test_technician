import { expect, test } from '@playwright/test';

const profileImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const job = {
  id: 'job-frontend-1',
  objective: 'Frontend Engineer',
  tagline: 'Build accessible React interfaces for a product team.',
  details: 'Own the frontend experience, performance, and product polish.',
  type: 'full-time',
  locations: ['Remote'],
  organizations: [{ name: 'Acme Labs' }],
  compensation: { data: { code: 'USD' } },
};

const person = {
  username: 'alice',
  name: 'Alice Candidate',
  picture: profileImage,
  professionalHeadline: 'Product-minded React engineer',
};

const genome = {
  person,
  strengths: [
    { id: 'react', name: 'React' },
    { id: 'product', name: 'Product' },
  ],
  interests: [
    { id: 'ux', name: 'UX' },
  ],
};

async function fulfillJson(route, data, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  });
}

async function mockApi(page) {
  let favorites = [];

  await page.route('**/api/torre/jobs', async (route) => {
    await fulfillJson(route, { results: [job], total: 1 });
  });

  await page.route('**/api/torre/search', async (route) => {
    await fulfillJson(route, [person]);
  });

  await page.route('**/api/torre/genome/**', async (route) => {
    await fulfillJson(route, genome);
  });

  await page.route('**/api/torre/favorites**', async (route) => {
    const request = route.request();
    const method = request.method();

    if (method === 'POST') {
      const body = request.postDataJSON();
      const favorite = {
        _id: `favorite-${favorites.length + 1}`,
        userId: body.userId,
        itemId: body.itemId,
        type: body.type,
        data: body.data,
      };

      const exists = favorites.some(
        (item) => item.userId === favorite.userId
          && item.itemId === favorite.itemId
          && item.type === favorite.type,
      );

      if (!exists) {
        favorites = [...favorites, favorite];
      }

      await fulfillJson(route, favorite);
      return;
    }

    if (method === 'GET') {
      const url = new URL(request.url());
      const type = url.searchParams.get('type');
      const userId = url.searchParams.get('userId');
      const visibleFavorites = favorites.filter((favorite) => (
        (!type || favorite.type === type) && (!userId || favorite.userId === userId)
      ));

      await fulfillJson(route, visibleFavorites);
      return;
    }

    if (method === 'DELETE') {
      const favoriteId = request.url().split('/').pop();
      favorites = favorites.filter((favorite) => favorite._id !== favoriteId);
      await fulfillJson(route, { deleted: true });
      return;
    }

    await fulfillJson(route, { message: 'Method not allowed' }, 405);
  });

  await page.route('**/api/torre/analytics**', async (route) => {
    await fulfillJson(route, [
      { _id: 'developer', count: 3 },
      { _id: 'react', count: 1 },
    ]);
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'en');
  });
  await mockApi(page);
});

test('searches jobs, opens details, saves a job, and shows it in favorites', async ({ page }) => {
  await page.goto('/jobs');

  await page.getByLabel('Search jobs').fill('react');
  await page.getByRole('button', { name: 'Search' }).click();

  const jobCard = page.getByRole('article').filter({ hasText: job.objective });
  await expect(jobCard).toBeVisible();

  await jobCard.getByRole('button', { name: 'Details' }).click();
  await expect(page).toHaveURL(/\/job\/job-frontend-1/);
  await expect(page.getByRole('heading', { name: job.objective })).toBeVisible();

  await page.getByRole('button', { name: 'Save job' }).click();
  await expect(page.getByText('Job saved to favorites.')).toBeVisible();

  await page.getByRole('link', { name: 'Favorites' }).click();
  await page.getByRole('button', { name: /Jobs \(1\)/ }).click();
  await expect(page.getByRole('article').filter({ hasText: job.objective })).toBeVisible();
});

test('searches people, opens a genome, saves a profile, and shows it in favorites', async ({ page }) => {
  await page.goto('/search');

  await page.getByLabel('Search people').fill('react');
  await page.getByRole('button', { name: 'Search' }).click();

  const personCard = page.getByRole('article').filter({ hasText: person.name });
  await expect(personCard).toBeVisible();

  await personCard.getByRole('button', { name: 'Genome' }).click();
  await expect(page).toHaveURL(/\/genome\/alice/);
  await expect(page.getByRole('heading', { name: person.name })).toBeVisible();
  await expect(page.getByText('React', { exact: true })).toBeVisible();

  await page.goBack();
  await expect(personCard).toBeVisible();
  await personCard.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('@alice saved to favorites.')).toBeVisible();

  await page.getByRole('link', { name: 'Favorites' }).click();
  await expect(page.getByRole('article').filter({ hasText: person.name })).toBeVisible();
});

test('renders analytics search terms', async ({ page }) => {
  await page.goto('/analytics');

  await expect(page.getByRole('heading', { name: 'Most searched terms' })).toBeVisible();
  await expect(page.getByText('developer')).toBeVisible();
  await expect(page.getByText('3 searches')).toBeVisible();
});
