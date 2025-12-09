import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { getEnv } from './env.helper.js';

export class AuthenticationHelper {
  constructor(page) {
    this.page = page;
  }

  async ensureAuthenticated() {
    const { url } = getEnv();
    
    try {
      // Try to navigate to wp-admin
      await this.page.goto(`${url}/wp-admin/`);
      
      // Check if we're already authenticated
      const dashboardTitle = this.page.locator('#wpbody-content h1');
      const loginForm = this.page.locator('#loginform');
      
      // Wait for either dashboard or login form to appear
      await Promise.race([
        dashboardTitle.waitFor({ timeout: 5000 }),
        loginForm.waitFor({ timeout: 5000 })
      ]);

      // If we see the dashboard, we're already authenticated
      if (await dashboardTitle.isVisible()) {
        await expect(dashboardTitle).toContainText('Dashboard');
        return;
      }

      // If we see the login form, authenticate
      if (await loginForm.isVisible()) {
        const loginPage = new LoginPage(this.page);
        await loginPage.loginOnCurrentPage();
        
        // Verify login was successful
        await expect(dashboardTitle).toContainText('Dashboard');
        return;
      }

      // If neither is visible, something went wrong
      throw new Error('Unable to determine authentication state');
      
    } catch (error) {
      // Fallback: go to login page and authenticate
      console.log('Fallback authentication required');
      const loginPage = new LoginPage(this.page);
      await loginPage.goto();
      await loginPage.login();
    }
  }
}
