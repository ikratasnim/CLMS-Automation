export class WordPressHelper {
  /**
   * Navigate to WordPress admin dashboard
   */
  static async navigateToAdmin(page, url) {
    await page.goto(`${url}/wp-admin/`);
    await page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to WordPress plugins page
   */
  static async navigateToPlugins(page, url) {
    await page.goto(`${url}/wp-admin/plugins.php`);
    await page.waitForSelector('#the-list');
  }

  /**
   * Check if a plugin is activated
   */
  static async isPluginActivated(page, pluginName) {
    const pluginRow = page.locator('#the-list tr').filter({ hasText: pluginName });
    const deactivateLink = pluginRow.locator('.deactivate');
    return await deactivateLink.isVisible();
  }

  /**
   * Activate a plugin if not already activated
   */
  static async activatePlugin(page, pluginName) {
    const pluginRow = page.locator('#the-list tr').filter({ hasText: pluginName });
    const activateLink = pluginRow.locator('.activate a');
    
    if (await activateLink.isVisible()) {
      await activateLink.click();
      await page.waitForLoadState('networkidle');
      console.log(`✅ Plugin "${pluginName}" has been activated.`);
      return true;
    }
    
    console.log(`✅ Plugin "${pluginName}" is already activated.`);
    return false;
  }

  /**
   * Navigate to a custom admin page
   */
  static async navigateToCustomAdminPage(page, url, pagePath) {
    await page.goto(`${url}/wp-admin/${pagePath}`);
    await page.waitForLoadState('networkidle');
  }

  /**
   * Wait for WordPress admin to fully load
   */
  static async waitForAdminLoad(page) {
    await page.waitForSelector('#wpbody-content');
    await page.waitForLoadState('networkidle');
  }
}
