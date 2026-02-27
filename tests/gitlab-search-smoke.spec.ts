import { test, expect } from '@playwright/test';

test('Search functionality', async ({ page }) => {
    await page.goto('https://about.gitlab.com/', { waitUntil: 'networkidle' });
    
    // accept cookie
    await page.locator('#onetrust-accept-btn-handler').click({ timeout: 10000 });
    
    // click search
    const searchButton = page.locator('button[data-nav="site search"]').first();
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    // search input
    const searchInput = page.locator('div.be-nav-search-content__input input[placeholder="Search"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('gitlab');
    await searchInput.press('Enter');
});