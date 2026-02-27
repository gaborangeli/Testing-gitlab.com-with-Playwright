import { test, expect } from '@playwright/test';

test('Navigate to video player and play video', async ({ page }) => {
    await page.goto('https://about.gitlab.com/', { waitUntil: 'networkidle' });
    
    // accept cookie
    await page.locator('#onetrust-accept-btn-handler').click({ timeout: 10000 });
    
    // click play
    const initialPlayButton = page.locator('.inline-video-player__play-button--center.inline-video-player__play-button');
    await expect(initialPlayButton).toBeVisible();
    await initialPlayButton.click();
    
    // iframe
    const vimeoFrame = page.frameLocator('iframe[src*="player.vimeo.com"]');
    const iframePlayButton = vimeoFrame.locator('[data-play-button="true"]');
    await expect(iframePlayButton).toBeVisible({ timeout: 10000 });
    await iframePlayButton.click();
    await page.waitForTimeout(1000);

    // click pause
    await page.waitForTimeout(2000);
    await vimeoFrame.locator('body').hover();
    const pauseButton = vimeoFrame.locator('[data-play-button="true"]').first();
    await expect(pauseButton).toBeVisible({ timeout: 10000 });
    await pauseButton.click();
    await page.waitForTimeout(1000);

    // click unmute
    const unmuteButton = vimeoFrame.locator('[data-volume-button="true"]');
    await unmuteButton.click();

    // click cc buton
    const ccButton = vimeoFrame.locator('[data-cc-button="true"]');
    await ccButton.click();

    // click settings button
    const settingsButton = vimeoFrame.getByRole('button', { name: 'Settings' });
    await settingsButton.click();

    // click transcript
    const transcriptButton = vimeoFrame.locator('#transcript-control-bar-button');
    await transcriptButton.click();

    // click picture in picture then close
    const pipButton = vimeoFrame.locator('[data-pip-button="true"]');
    await pipButton.click();
    await pipButton.click();

    // click fullscreen button then close
    const fullscreenButton = vimeoFrame.locator('[data-fullscreen-button="true"]');
    await fullscreenButton.click();
    await fullscreenButton.click();
});