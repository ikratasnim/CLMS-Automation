export class MediaHelper {
  /**
   * Get the path to a test image file
   */
  static getTestImagePath() {
    return './test-assets/test-image.jpg';
  }

  /**
   * Get the path to a test video file
   */
  static getTestVideoPath() {
    return './test-assets/test-video.mp4';
  }

  /**
   * Verify that a media file exists in the WordPress media library
   */
  static async verifyMediaInLibrary(page, fileName) {
    const mediaItem = page.locator(`[aria-label*="${fileName}"]`);
    return await mediaItem.isVisible();
  }

  /**
   * Select the first available image from WordPress media library
   */
  static async selectFirstImageFromLibrary(page) {
    await page.getByRole('tab', { name: 'Media Library' }).click();
    await page.waitForTimeout(2000);
    
    const firstImage = page.locator('.attachment-preview').first();
    await firstImage.click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: 'Select' }).click();
    await page.waitForTimeout(2000);
  }

  /**
   * Select the first available video from WordPress media library
   */
  static async selectFirstVideoFromLibrary(page) {
    await page.getByRole('tab', { name: 'Media Library' }).click();
    await page.waitForTimeout(2000);
    
    const firstVideo = page.locator('.attachment[data-id]').first();
    await firstVideo.click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('button', { name: 'Select' }).click();
    await page.waitForTimeout(2000);
  }
}
