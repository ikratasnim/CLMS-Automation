import { test, expect } from '@playwright/test';

// Base URL configuration - Update this for different sites
const BASE_URL = 'http://creator-lms-automation.local';

// Global helper for login and course setup
async function loginAndSetupCourse(page, username, password, courseName) {
  await page.goto(`${BASE_URL}/wp-login.php`);
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');
  await page.waitForTimeout(3000);
  await expect(page).toHaveURL(/wp-admin/);
  await page.waitForTimeout(3000);
  await page.hover('text=Creator LMS');
  await page.click('text=Courses');
  await page.click('text=Add Course');
  
  // Click on Start from Scratch
  await page.click('text=Start from Scratch');
  await page.waitForTimeout(1000);
  
  // Enter course title
  await page.fill('input[placeholder="Enter Course Title"]', courseName);
  
  // Click Next to go to Settings tab
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(1000);
  
  // Click on Paid radio button
  await page.getByRole('radio', { name: 'Paid' }).click();
  await page.waitForTimeout(1000);
  
  // Set paid course price to 10
  await page.locator('//div[contains(@class, "crlms-price-range")]//input[@placeholder="0.00" and @type="number"]').first().fill('10');
  await page.waitForTimeout(1000);
  
  // Click Next to go to Preview
  await page.locator("//button[normalize-space()='Next']").click();
  await page.waitForTimeout(1000);
  
  // Publish the course
  await page.locator("//button[normalize-space()='Publish']").click();
  await page.waitForTimeout(3000);
}

test.describe('Payment Method Validation', () => {
  test('validate offline payment', async ({ page }) => {
    await loginAndSetupCourse(page, 'root', 'root', 'Offline Payment Test Course');
    
    // Extract course ID from current URL
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    const courseIdMatch = currentUrl.match(/course[s]?[/-](\d+)/i) || currentUrl.match(/id[=](\d+)/i) || currentUrl.match(/(\d+)/);
    let courseId = null;
    if (courseIdMatch) {
      courseId = courseIdMatch[1];
      console.log(`Extracted course ID: ${courseId}`);
    } else {
      console.log('Could not extract course ID from URL');
    }
    
    // Navigate to Settings
    await page.hover('text=Creator LMS');
    await page.click('text=Settings');
    await page.waitForTimeout(2000);
    
    // Validate if in Settings tab (check h1 tag is Settings - ss2)
    const settingsHeading = page.locator('h1:has-text("Settings")');
    await expect(settingsHeading).toBeVisible();
    console.log('Settings page validated');
    await page.screenshot({ path: 'settings-page.png', fullPage: true });
    
    // Click on Payment tab (ss1)
    await page.click('button:has-text("Payments")');
    await page.waitForTimeout(1000);
    
    // Validate if in the 2nd payment tab below (ss3)
    const paymentsTab = page.locator('button:has-text("Payments")').first();
    await expect(paymentsTab).toBeVisible();
    console.log('Payment tab validated');
    
    // Check if offline payment is already enabled
    const offlineToggle = page.locator('.crlms-offline-payment .crlms-switcher-wrapper .components-form-toggle .components-form-toggle__input');
    const isOfflineEnabled = await offlineToggle.isChecked();
    console.log(`Offline payment is ${isOfflineEnabled ? 'already enabled' : 'not enabled'}`);
    
    if (isOfflineEnabled) {
      // Offline payment is already enabled, skip settings configuration
      console.log('Offline payment is already enabled, skipping settings configuration');
    } else {
      // Enable offline payment and configure settings
      console.log('Enabling offline payment and configuring settings');
      
      // Enable the offline payment
      await offlineToggle.click();
      await page.waitForTimeout(2000);
      
      // Validate after enabling offline notification is displaying
      const notificationWindow = page.getByText('NoticeOffline payment payment');
      await expect(notificationWindow).toBeVisible({ timeout: 10000 });
      
      // Validate the full notification message (use first() to avoid strict mode violation)
      const successMessage = page.locator('text=Offline payment payment enabled successfully.').first();
      await expect(successMessage).toBeVisible({ timeout: 5000 });
      console.log('Offline payment enabled successfully');
      
      // Verify Manage button is enabled and click on it (ss1)
      const manageButton = page.locator('.crlms-offline-payment .crlms-payment-manage-button');
      await expect(manageButton).toBeEnabled();
      console.log('Manage button is enabled');
      await manageButton.click();
      await page.waitForTimeout(1000);
      
      // Validate 'Offline payment Payment' is visible (ss1)
      const offlinePaymentHeading = page.getByRole('heading', { name: 'Offline payment Payment' });
      await expect(offlinePaymentHeading).toBeVisible();
      console.log('Offline payment Payment heading is visible');
      
      // Enable test mode toggle (ss2)
      const testModeToggle = page.locator('.crlms-gateway-offline .crlms-switcher-test_mode .crlms-switcher-wrapper .components-form-toggle__input');
      await testModeToggle.click();
      await page.waitForTimeout(1000);
      console.log('Test mode enabled');
      
      // Clear and enter title field data (ss3)
      const titleField = page.locator('.crlms-gateway-offline .crlms-input-title input');
      await titleField.click();
      await titleField.fill('Offline payment');
      await expect(titleField).toHaveValue('Offline payment');
      console.log('Title field updated: Offline payment');
      
      // Clear and enter instruction field data (ss3)
      const instructorField = page.locator('.crlms-gateway-offline .crlms-payment-instructions textarea');
      await instructorField.click();
      await instructorField.fill('Pay with offline payment.');
      await expect(instructorField).toHaveValue('Pay with offline payment.');
      console.log('Instructor field updated: Pay with offline payment.');
      
      // Click on save changes button
      const saveChangesButton = page.locator("//button[normalize-space()='Save Changes']");
      await saveChangesButton.click();
      await page.waitForTimeout(2000);
      
      // Validate after click on save changes notification window will appear
      const saveNotification = page.locator("//div[@class='crlms-tabs-content payments-settings']//div[@class='crlms-notice-wrapper']");
      await expect(saveNotification).toBeVisible({ timeout: 10000 });
      
      // Validate notification message
      const saveNotificationMessage = page.locator('text=Payment Settings Saved Successfully.');
      await expect(saveNotificationMessage.first()).toBeVisible({ timeout: 5000 });
      console.log('Payment Settings Saved Successfully');
      await page.waitForTimeout(3000);
      
      // Take screenshot after saving payment settings
      await page.screenshot({ path: 'offline-payment-settings-saved.png', fullPage: true });
      console.log('Screenshot saved: offline-payment-settings-saved.png');
    }
    
    // Navigate directly to frontend courses page
    const frontendPage = await page.context().newPage();
    await frontendPage.goto(`${BASE_URL}/cr-all-courses/`);
    await frontendPage.waitForLoadState('domcontentloaded');
    await frontendPage.waitForTimeout(2000);
    
    // Validate that the new tab has a different URL from the original page
    expect(frontendPage.url()).not.toBe(page.url());
    console.log('Original page URL:', page.url());
    console.log('Frontend listing page URL:', frontendPage.url());
    
    // Locate course by ID
    const courseContainer = frontendPage.locator(`#course-${courseId}`);
    await expect(courseContainer).toBeVisible({ timeout: 10000 });
    console.log(`Course container found for ID: ${courseId}`);
    
    // Validate the course title on frontend listing page
    const courseTitle = courseContainer.locator('h2');
    await expect(courseTitle).toBeVisible({ timeout: 10000 });
    const courseTitleText = await courseTitle.textContent();
    expect(courseTitleText.trim()).toBe('Offline Payment Test Course');
    console.log('Course title validated on frontend:', courseTitleText);
    
    // Click on Buy button for the specific course
    const buyButton = courseContainer.locator(`button:has-text("Buy"), a:has-text("Buy")`);
    console.log(`Clicking Buy button for course ID: ${courseId}`);
    await buyButton.click();
    await frontendPage.waitForTimeout(2000);
    
    // Validate redirect to checkout page from URL
    await expect(frontendPage).toHaveURL(/checkout/, { timeout: 10000 });
    console.log('Redirected to checkout page');
    console.log('Checkout page URL:', frontendPage.url());
    
    // Validate Order Summary heading is visible (ss2)
    const orderSummaryHeading = frontendPage.locator("//h3[normalize-space()='Order Summary']");
    await expect(orderSummaryHeading).toBeVisible();
    console.log('Order Summary heading is visible');
    
    // Validate the course title in order summary matches (ss3)
    const orderCourseName = frontendPage.locator('text=Offline Payment Test Course').first();
    await expect(orderCourseName).toBeVisible();
    const orderCourseNameText = await orderCourseName.textContent();
    expect(orderCourseNameText.trim()).toContain('Offline Payment Test Course');
    console.log('Course title in order summary validated:', orderCourseNameText);
    
    // Validate the price value matches what we set ($10.00) (ss4)
    const priceAmount = frontendPage.locator('//h3[normalize-space()="Order Summary"]/following::*[contains(@class,"crlms-price-amount")]').first();
    await expect(priceAmount).toBeVisible({ timeout: 5000 });
    const priceText = await priceAmount.textContent();
    expect(priceText.trim()).toMatch(/10\.00|10/);
    console.log('Price validated in order summary:', priceText.trim());
    
    // Fill in the checkout form fields (ss5)
    await frontendPage.getByRole('textbox', { name: 'Email *' }).fill('dev-email@wpengine.local');
    await frontendPage.getByRole('textbox', { name: 'First Name *' }).fill('John');
    await frontendPage.getByRole('textbox', { name: 'Last Name *' }).fill('Doe');
    await frontendPage.getByRole('textbox', { name: 'Address *' }).fill('123 Main Street');
    console.log('Checkout form fields filled');
    
    // Country should be kept as US (validate it's already selected)
    const countrySelect = frontendPage.locator('select').filter({ hasText: 'United States' });
    await expect(countrySelect.first()).toBeVisible();
    console.log('Country is set to United States (US)');
    
    // Click on Offline Payment radio button
    const offlinePaymentRadio = frontendPage.locator('.radiobox');
    await offlinePaymentRadio.click();
    await frontendPage.waitForTimeout(1000);
    console.log('Offline Payment radio button selected');
    
    // Store checkout page URL before completing checkout
    const checkoutUrl = frontendPage.url();
    console.log('Checkout page URL:', checkoutUrl);
    
    // Click on Complete Checkout button
    const completeCheckoutButton = frontendPage.getByRole('button', { name: 'Complete Checkout' });
    await completeCheckoutButton.click();
    await frontendPage.waitForTimeout(3000);
    console.log('Complete Checkout button clicked');
    
    // Validate redirect to thank you page (URL should be different from checkout)
    await frontendPage.waitForLoadState('networkidle', { timeout: 10000 });
    const thankYouUrl = frontendPage.url();
    expect(thankYouUrl).not.toBe(checkoutUrl);
    console.log('Redirected to Thank You page');
    console.log('Thank You page URL:', thankYouUrl);
    
    // Validate "Access To Your Course" button is visible
    const accessCourseButton = frontendPage.locator("//a[normalize-space()='Access To Your Course']");
    await expect(accessCourseButton).toBeVisible({ timeout: 10000 });
    console.log('Access To Your Course button is visible');
    
    // Take screenshot of thank you page
    await frontendPage.screenshot({ path: 'thank-you-page.png', fullPage: true });
    console.log('Screenshot saved: thank-you-page.png');
    
    // Click on copy icon beside Order ID to copy it
    const copyOrderIdIcon = frontendPage.locator("//button[@type='button']//*[name()='svg']");
    await copyOrderIdIcon.click();
    await frontendPage.waitForTimeout(1000);
    console.log('Clicked copy icon for Order ID');
    
    // Get the Order ID text
    const orderIdElement = frontendPage.locator("//span[contains(@class,'thankyou-order-id-text')]");
    const orderId = await orderIdElement.textContent();
    const orderIdTrimmed = orderId.trim().replace('#', '');
    console.log('Order ID copied:', orderIdTrimmed);
    
    // Close the thank you page tab
    await frontendPage.close();
    await page.waitForTimeout(1000);
    console.log('Thank you page tab closed');
    
    // Validate we're back to the previous tab (check Creator LMS is visible)
    await page.bringToFront();
    const creatorLMSHeading = page.locator("//div[normalize-space()='Creator LMS']");
    await expect(creatorLMSHeading).toBeVisible({ timeout: 5000 });
    console.log('Validated back on admin page - Creator LMS is visible');
    
    // Click on Orders from WordPress menu bar
    await page.hover('text=Creator LMS');
    await page.waitForTimeout(1000);
    await page.click("//a[normalize-space()='Orders']");
    await page.waitForTimeout(2000);
    console.log('Clicked on Orders from menu');
    
    // Validate redirected to Order Management page
    const orderManagementHeading = page.locator("//h1[normalize-space()='Order Management']");
    await expect(orderManagementHeading).toBeVisible({ timeout: 10000 });
    console.log('Order Management page validated');
    
    // Validate if the order ID exists in the orders list
    const orderRow = page.locator(`//tr[contains(., '#${orderIdTrimmed}') or contains(., '${orderIdTrimmed}')]`);
    await expect(orderRow).toBeVisible({ timeout: 10000 });
    console.log(`Order ID ${orderIdTrimmed} found in orders list`);
    
    // Validate Payment Method is Offline
    const paymentMethod = orderRow.locator("//span[contains(text(),'offline')]");
    await expect(paymentMethod).toBeVisible();
    const paymentMethodText = await paymentMethod.textContent();
    expect(paymentMethodText.trim().toLowerCase()).toContain('offline');
    console.log('Payment Method validated: Offline');
    
    // Validate Total amount is $10.00 (7th column - Total column)
    const totalAmount = orderRow.locator('td').nth(7);
    await expect(totalAmount).toBeVisible();
    const totalAmountText = await totalAmount.textContent();
    expect(totalAmountText.trim()).toContain('$10.00');
    console.log('Total amount validated:', totalAmountText.trim());
    
    // Validate Status is Completed
    const orderStatus = orderRow.locator("//span[contains(text(),'completed')] | //td[contains(text(),'completed')]");
    await expect(orderStatus).toBeVisible();
    const orderStatusText = await orderStatus.textContent();
    expect(orderStatusText.trim().toLowerCase()).toContain('completed');
    console.log('Order status validated: Completed');
    
    // Take final screenshot of Order Management page
    await page.screenshot({ path: 'order-management-page.png', fullPage: true });
    console.log('Screenshot saved: order-management-page.png');
    
    console.log('✅ Offline payment validation completed successfully');
  });

  test('validate stripe payment', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes timeout
    
    await loginAndSetupCourse(page, 'root', 'root', 'Stripe Payment Test Course');
    
    // Extract course ID from current URL
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    const courseIdMatch = currentUrl.match(/course[s]?[/-](\d+)/i) || currentUrl.match(/id[=](\d+)/i) || currentUrl.match(/(\d+)/);
    let courseId = null;
    if (courseIdMatch) {
      courseId = courseIdMatch[1];
      console.log(`Extracted course ID: ${courseId}`);
    } else {
      console.log('Could not extract course ID from URL');
    }
    
    // Navigate to Settings
    await page.hover('text=Creator LMS');
    await page.click('text=Settings');
    await page.waitForTimeout(2000);
    
    // Validate if in Settings tab (check h1 tag is Settings - ss2)
    const settingsHeading = page.locator('h1:has-text("Settings")');
    await expect(settingsHeading).toBeVisible();
    console.log('Settings page validated');
    await page.screenshot({ path: 'stripe-settings-page.png', fullPage: true });
    
    // Click on Payment tab (ss1)
    await page.click('button:has-text("Payments")');
    await page.waitForTimeout(1000);
    
    // Validate if in the 2nd payment tab below (ss3)
    const paymentsTab = page.locator('button:has-text("Payments")').first();
    await expect(paymentsTab).toBeVisible();
    console.log('Payment tab validated');
    
    // Check if stripe payment is already enabled
    const stripeToggle = page.locator('.crlms-stripe-payment .crlms-switcher-wrapper .components-form-toggle .components-form-toggle__input');
    const isStripeEnabled = await stripeToggle.isChecked();
    console.log(`Stripe payment is ${isStripeEnabled ? 'already enabled' : 'not enabled'}`);
    
    if (isStripeEnabled) {
      // Stripe payment is already enabled, skip settings configuration
      console.log('Stripe payment is already enabled, skipping settings configuration');
    } else {
      // Enable stripe payment and configure settings
      console.log('Enabling stripe payment and configuring settings');
      
      // Enable the stripe payment
      await stripeToggle.click();
      await page.waitForTimeout(2000);
      
      // Validate after enabling stripe notification is displaying
      const notificationWindow = page.getByText('NoticeStripe payment');
      await expect(notificationWindow).toBeVisible({ timeout: 10000 });
      
      // Validate the full notification message (use first() to avoid strict mode violation)
      const successMessage = page.locator('text=Stripe payment enabled successfully.').first();
      await expect(successMessage).toBeVisible({ timeout: 5000 });
      console.log('Stripe payment enabled successfully');
      
      // Verify Manage button is enabled and click on it
      const manageButton = page.locator('.crlms-stripe-payment .crlms-payment-manage-button');
      await expect(manageButton).toBeEnabled();
      console.log('Manage button is enabled');
      await manageButton.click();
      await page.waitForTimeout(1000);
      
      // Validate 'Stripe Payment Method' is visible
      const stripePaymentHeading = page.locator("//h3[normalize-space()='Stripe Payment Method']");
      await expect(stripePaymentHeading).toBeVisible();
      console.log('Stripe Payment Method heading is visible');
      
      // Enable test mode toggle
      const testModeToggle = page.locator('.crlms-gateway-stripe .crlms-switcher-test_mode .crlms-switcher-wrapper .components-form-toggle__input');
      await testModeToggle.click();
      await page.waitForTimeout(1000);
      console.log('Test mode enabled');
      
      // Enter Sandbox Publisher Key
      const sandboxPublisherKeyField = page.locator('.crlms-gateway-stripe .crlms-input-sandbox_publishable_key input');
      await sandboxPublisherKeyField.clear();
      await sandboxPublisherKeyField.fill('pk_test_51RqqJXEDdXrT7sBdaE6yZU1zc0Lo4nKYhGU4tW9xB3u0O8xBmYAf6awCpEpSjFBleEB8Pwf4ijnCqoql9gm0zuKe00u0kJJnvS');
      await expect(sandboxPublisherKeyField).toHaveValue('pk_test_51RqqJXEDdXrT7sBdaE6yZU1zc0Lo4nKYhGU4tW9xB3u0O8xBmYAf6awCpEpSjFBleEB8Pwf4ijnCqoql9gm0zuKe00u0kJJnvS');
      console.log('Sandbox Publisher Key entered');
      
      // Enter Sandbox Secret Key
      const sandboxSecretKeyField = page.locator('.crlms-gateway-stripe .crlms-input-sandbox_secret_key input');
      await sandboxSecretKeyField.clear();
      await sandboxSecretKeyField.fill('YOUR_STRIPE_TEST_SECRET_KEY');
      await expect(sandboxSecretKeyField).toHaveValue('YOUR_STRIPE_TEST_SECRET_KEY');
      console.log('Sandbox Secret Key entered');
      
      // Clear and enter title field data
      const titleField = page.locator('.crlms-gateway-stripe .crlms-input-title input');
      await titleField.clear();
      await titleField.fill('Stripe payment');
      await expect(titleField).toHaveValue('Stripe payment');
      console.log('Title field updated: Stripe payment');
      
      // Clear and enter instruction field data
      const instructorField = page.locator('.crlms-gateway-stripe .crlms-payment-instructions textarea');
      await instructorField.clear();
      await instructorField.fill('Pay with stripe payment.');
      await expect(instructorField).toHaveValue('Pay with stripe payment.');
      console.log('Instructor field updated: Pay with stripe payment.');
      
      // Scroll down and click on save changes button
      const saveChangesButton = page.locator("//button[normalize-space()='Save Changes']");
      await saveChangesButton.scrollIntoViewIfNeeded();
      await saveChangesButton.click();
      await page.waitForTimeout(2000);
      
      // Validate after click on save changes notification window will appear
      const saveNotification = page.locator("//div[@class='crlms-tabs-content payments-settings']//div[@class='crlms-notice-wrapper']");
      await expect(saveNotification).toBeVisible({ timeout: 10000 });
      
      // Validate notification message
      const saveNotificationMessage = page.locator('text=Payment Settings Saved Successfully.');
      await expect(saveNotificationMessage.first()).toBeVisible({ timeout: 5000 });
      console.log('Payment Settings Saved Successfully');
      await page.waitForTimeout(3000);
      
      // Take screenshot after saving payment settings
      await page.screenshot({ path: 'stripe-payment-settings-saved.png', fullPage: true });
      console.log('Screenshot saved: stripe-payment-settings-saved.png');
    }
    
    // Navigate directly to frontend courses page
    const frontendPage = await page.context().newPage();
    await frontendPage.goto(`${BASE_URL}/cr-all-courses/`);
    await frontendPage.waitForLoadState('domcontentloaded');
    await frontendPage.waitForTimeout(2000);
    
    // Validate that the new tab has a different URL from the original page
    expect(frontendPage.url()).not.toBe(page.url());
    console.log('Original page URL:', page.url());
    console.log('Frontend listing page URL:', frontendPage.url());
    
    // Locate course by ID
    const courseContainer = frontendPage.locator(`#course-${courseId}`);
    await expect(courseContainer).toBeVisible({ timeout: 10000 });
    console.log(`Course container found for ID: ${courseId}`);
    
    // Validate the course title on frontend listing page
    const courseTitle = courseContainer.locator('h2');
    await expect(courseTitle).toBeVisible({ timeout: 10000 });
    const courseTitleText = await courseTitle.textContent();
    expect(courseTitleText.trim()).toBe('Stripe Payment Test Course');
    console.log('Course title validated on frontend:', courseTitleText);
    
    // Click on Buy button for the specific course
    const buyButton = courseContainer.locator(`button:has-text("Buy"), a:has-text("Buy")`);
    console.log(`Clicking Buy button for course ID: ${courseId}`);
    await buyButton.click();
    await frontendPage.waitForTimeout(2000);
    
    // Validate redirect to checkout page from URL
    await expect(frontendPage).toHaveURL(/checkout/, { timeout: 10000 });
    console.log('Redirected to checkout page');
    console.log('Checkout page URL:', frontendPage.url());
    
    // Validate Order Summary heading is visible (ss2)
    const orderSummaryHeading = frontendPage.locator("//h3[normalize-space()='Order Summary']");
    await expect(orderSummaryHeading).toBeVisible();
    console.log('Order Summary heading is visible');
    
    // Validate the course title in order summary matches (ss3)
    const orderCourseName = frontendPage.locator('text=Stripe Payment Test Course').first();
    await expect(orderCourseName).toBeVisible();
    const orderCourseNameText = await orderCourseName.textContent();
    expect(orderCourseNameText.trim()).toContain('Stripe Payment Test Course');
    console.log('Course title in order summary validated:', orderCourseNameText);
    
    // Validate the price value matches what we set ($10.00) (ss4)
    const priceAmount = frontendPage.locator('//h3[normalize-space()="Order Summary"]/following::*[contains(@class,"crlms-price-amount")]').first();
    await expect(priceAmount).toBeVisible({ timeout: 5000 });
    const priceText = await priceAmount.textContent();
    expect(priceText.trim()).toMatch(/10\.00|10/);
    console.log('Price validated in order summary:', priceText.trim());
    
    // Fill in the checkout form fields (ss5)
    await frontendPage.getByRole('textbox', { name: 'Email *' }).fill('dev-email@wpengine.local');
    await frontendPage.getByRole('textbox', { name: 'First Name *' }).fill('John');
    await frontendPage.getByRole('textbox', { name: 'Last Name *' }).fill('Doe');
    await frontendPage.getByRole('textbox', { name: 'Address *' }).fill('123 Main Street');
    console.log('Checkout form fields filled');
    
    // Country should be kept as US (validate it's already selected)
    const countrySelect = frontendPage.locator('select').filter({ hasText: 'United States' });
    await expect(countrySelect.first()).toBeVisible();
    console.log('Country is set to United States (US)');
    
    // Click on Stripe Payment radio button
    const stripePaymentRadio = frontendPage.locator('.creator-lms-single-payment.crlms_payment_method.payment_method_stripe > .creator-lms-radiobtn > .creator-lms-radiobtn-text > .radiobox');
    await stripePaymentRadio.click();
    console.log('Stripe Payment radio button selected');
    
    // Wait for Stripe to initialize and iframes to load
    await frontendPage.waitForTimeout(4000);
    
    // Fill Stripe card fields with improved retry logic
    let cardFilled = false;
    let expiryFilled = false;
    let cvcFilled = false;
    let attempts = 0;
    const maxAttempts = 15;
    
    while (attempts < maxAttempts && (!cardFilled || !expiryFilled || !cvcFilled)) {
      attempts++;
      
      // Wait between attempts for frames to load
      if (attempts > 1) {
        await frontendPage.waitForTimeout(1500);
      }
      
      const frames = frontendPage.frames();
      console.log(`Attempt ${attempts}: Found ${frames.length} frames`);
      
      for (const frame of frames) {
        try {
          const frameUrl = frame.url();
          
          // Check for Stripe iframes
          if (frameUrl.includes('js.stripe.com')) {
            const inputs = await frame.locator('input').all();
            
            for (const input of inputs) {
              try {
                const placeholder = await input.getAttribute('placeholder').catch(() => null);
                const ariaLabel = await input.getAttribute('aria-label').catch(() => null);
                
                // Card number field
                if (!cardFilled && (
                  (placeholder && placeholder.includes('1234')) ||
                  (ariaLabel && ariaLabel.toLowerCase().includes('card number'))
                )) {
                  await input.fill('4242424242424242');
                  console.log('✓ Card number filled');
                  cardFilled = true;
                }
                
                // Expiry field
                if (!expiryFilled && (
                  (placeholder && placeholder.includes('MM')) ||
                  (ariaLabel && ariaLabel.toLowerCase().includes('expir'))
                )) {
                  await input.fill('1228');
                  console.log('✓ Expiry date filled');
                  expiryFilled = true;
                }
                
                // CVC field
                if (!cvcFilled && (
                  (placeholder && (placeholder.includes('CVC') || placeholder.includes('CVV'))) ||
                  (ariaLabel && (ariaLabel.toLowerCase().includes('cvc') || ariaLabel.toLowerCase().includes('security')))
                )) {
                  await input.fill('123');
                  console.log('✓ CVC filled');
                  cvcFilled = true;
                }
              } catch (e) {
                // Skip input if can't access attributes
              }
            }
          }
        } catch (e) {
          // Skip frames we can't access
        }
      }
      
      // Break early if all fields filled
      if (cardFilled && expiryFilled && cvcFilled) {
        console.log('All Stripe fields successfully filled');
        break;
      }
    }
    
    console.log(`Fields status - Card: ${cardFilled}, Expiry: ${expiryFilled}, CVC: ${cvcFilled}`);
    
    if (!cardFilled || !expiryFilled || !cvcFilled) {
      throw new Error('Failed to fill all Stripe card fields after ' + attempts + ' attempts');
    }
    
    await frontendPage.waitForTimeout(2000);
    
    // Store checkout page URL before completing checkout
    const checkoutUrl = frontendPage.url();
    console.log('Checkout page URL:', checkoutUrl);
    
    // Click on Complete Checkout button
    const completeCheckoutButton = frontendPage.getByRole('button', { name: 'Complete Checkout' });
    await completeCheckoutButton.click();
    console.log('Complete Checkout button clicked');
    
    // Wait for Stripe processing and redirect to thank you page
    await frontendPage.waitForTimeout(8000);
    
    // Wait for URL to change or for success indicator
    try {
      await frontendPage.waitForURL(url => url.toString() !== checkoutUrl, { timeout: 15000 });
      console.log('Redirected to Thank You page');
    } catch (e) {
      console.log('URL did not change, checking for success message or error...');
      // Take screenshot for debugging
      await frontendPage.screenshot({ path: 'checkout-stuck.png', fullPage: true });
    }
    
    const thankYouUrl = frontendPage.url();
    console.log('Current page URL:', thankYouUrl);
    expect(thankYouUrl).not.toBe(checkoutUrl);
    
    // Validate "Access To Your Course" button is visible
    const accessCourseButton = frontendPage.locator("//a[normalize-space()='Access To Your Course']");
    await expect(accessCourseButton).toBeVisible({ timeout: 10000 });
    console.log('Access To Your Course button is visible');
    
    // Take screenshot of thank you page
    await frontendPage.screenshot({ path: 'stripe-thank-you-page.png', fullPage: true });
    console.log('Screenshot saved: stripe-thank-you-page.png');
    
    // Click on copy icon beside Order ID to copy it
    const copyOrderIdIcon = frontendPage.locator("//button[@type='button']//*[name()='svg']");
    await copyOrderIdIcon.click();
    await frontendPage.waitForTimeout(1000);
    console.log('Clicked copy icon for Order ID');
    
    // Get the Order ID text
    const orderIdElement = frontendPage.locator("//span[contains(@class,'thankyou-order-id-text')]");
    const orderId = await orderIdElement.textContent();
    const orderIdTrimmed = orderId.trim().replace('#', '');
    console.log('Order ID copied:', orderIdTrimmed);
    
    // Close the thank you page tab
    await frontendPage.close();
    await page.waitForTimeout(1000);
    console.log('Thank you page tab closed');
    
    // Validate we're back to the previous tab (check Creator LMS is visible)
    await page.bringToFront();
    const creatorLMSHeading = page.locator("//div[normalize-space()='Creator LMS']");
    await expect(creatorLMSHeading).toBeVisible({ timeout: 5000 });
    console.log('Validated back on admin page - Creator LMS is visible');
    
    // Click on Orders from WordPress menu bar
    await page.hover('text=Creator LMS');
    await page.waitForTimeout(1000);
    await page.click("//a[normalize-space()='Orders']");
    await page.waitForTimeout(2000);
    console.log('Clicked on Orders from menu');
    
    // Validate redirected to Order Management page
    const orderManagementHeading = page.locator("//h1[normalize-space()='Order Management']");
    await expect(orderManagementHeading).toBeVisible({ timeout: 10000 });
    console.log('Order Management page validated');
    
    // Validate if the order ID exists in the orders list
    const orderRow = page.locator(`//tr[contains(., '#${orderIdTrimmed}') or contains(., '${orderIdTrimmed}')]`);
    await expect(orderRow).toBeVisible({ timeout: 10000 });
    console.log(`Order ID ${orderIdTrimmed} found in orders list`);
    
    // Validate Payment Method is Stripe
    const paymentMethod = orderRow.locator("//span[contains(text(),'stripe')]");
    await expect(paymentMethod).toBeVisible();
    const paymentMethodText = await paymentMethod.textContent();
    expect(paymentMethodText.trim().toLowerCase()).toContain('stripe');
    console.log('Payment Method validated: Stripe');
    
    // Validate Total amount is $10.00 (7th column - Total column)
    const totalAmount = orderRow.locator('td').nth(7);
    await expect(totalAmount).toBeVisible();
    const totalAmountText = await totalAmount.textContent();
    expect(totalAmountText.trim()).toContain('$10.00');
    console.log('Total amount validated:', totalAmountText.trim());
    
    // Validate Status is Completed
    const orderStatus = orderRow.locator("//span[contains(text(),'completed')] | //td[contains(text(),'completed')]");
    await expect(orderStatus).toBeVisible();
    const orderStatusText = await orderStatus.textContent();
    expect(orderStatusText.trim().toLowerCase()).toContain('completed');
    console.log('Order status validated: Completed');
    
    // Take final screenshot of Order Management page
    await page.screenshot({ path: 'stripe-order-management-page.png', fullPage: true });
    console.log('Screenshot saved: stripe-order-management-page.png');
    
    console.log('✅ Stripe payment validation completed successfully');
  });
});
