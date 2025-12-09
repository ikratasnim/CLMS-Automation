import { expect } from '@playwright/test';
import { getEnv } from '../utils/env.helper.js';

const { url, username, password } = getEnv();

export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(`${url}/wp-login.php`);
  }

  async login() {
    await this.page.fill('#user_login', username);
    await this.page.fill('#user_pass', password);
    await this.page.click('#wp-submit');
    
    // Wait for navigation to wp-admin
    await this.page.waitForURL('**/wp-admin/**');
  }

  async loginOnCurrentPage() {
    // Use this when already on a login page (e.g., redirected from wp-admin)
    await this.page.fill('#user_login', username);
    await this.page.fill('#user_pass', password);
    await this.page.click('#wp-submit');
    
    // Wait for navigation to wp-admin
    await this.page.waitForURL('**/wp-admin/**');
  }

  async verifyLoginSuccess() {
    // Assert that the admin bar is visible (login successful)
    await expect(this.page.locator('#wpadminbar')).toBeVisible();
    
    // Validate that the h1 tag is 'Dashboard'
    const h1 = this.page.locator("//h1[normalize-space()='Dashboard']");
    await expect(h1).toHaveText('Dashboard');
  }

  async loginAndVerify() {
    await this.goto();
    await this.login();
    await this.verifyLoginSuccess();
    
    // Optionally, take a screenshot after login
    await this.page.screenshot({ path: 'login-success.png', fullPage: true });
    console.log('Screenshot saved as login-success.png');
  }
}
