import { test, expect } from '@playwright/test';

// Base URL configuration - Update this for different sites
const BASE_URL = 'http://creator-lms-automation.local';

// Global helper for login
async function login(page, username, password) {
  await page.goto(`${BASE_URL}/wp-login.php`);
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');
  await page.waitForTimeout(3000);
  await expect(page).toHaveURL(/wp-admin/);
  await page.waitForTimeout(3000);
}

test.describe('Dashboard Count Validation', () => {
  test('validate dashboard counts', async ({ page }) => {
    await login(page, 'root', 'root');
    
    // Navigate to Creator LMS Dashboard
    await page.click('text=Creator LMS');
    await page.waitForTimeout(2000);
    
    // Validate Overview heading is visible
    const overviewHeading = page.getByRole('heading', { name: 'Overview' });
    await expect(overviewHeading).toBeVisible();
    console.log('Overview heading validated');
    
    // Validate Earnings heading is visible
    const earningsHeading = page.getByRole('heading', { name: 'Earnings' });
    await expect(earningsHeading).toBeVisible();
    console.log('Earnings heading validated');
    
    // Take screenshot
    await page.screenshot({ path: 'dashboard-overview.png', fullPage: true });
    console.log('Screenshot saved: dashboard-overview.png');
    
    // Store current values from dashboard
    const incomeValue = await page.locator('.card-earning .crlms-card-value').textContent();
    console.log('Income:', incomeValue.trim());
    
    const refundValue = await page.locator('.card-refund .crlms-card-value').textContent();
    console.log('Refund:', refundValue.trim());
    
    const netIncomeValue = await page.locator('.card-net-income .crlms-card-value').textContent();
    console.log('Net Income:', netIncomeValue.trim());
    
    const coursesSoldValue = await page.locator('.card-courses-sold .crlms-card-value').textContent();
    console.log('Courses Sold:', coursesSoldValue.trim());
    
    const enrolleesValue = await page.locator('.card-students .crlms-card-value').textContent();
    console.log('Enrollees:', enrolleesValue.trim());
    
    // Navigate to Settings > Payments > Taxes
    await page.hover('text=Creator LMS');
    await page.click('text=Settings');
    await page.waitForTimeout(2000);
    console.log('Navigated to Settings');
    
    // Click on Payments tab
    await page.click('button:has-text("Payments")');
    await page.waitForTimeout(1000);
    console.log('Clicked on Payments tab');
    
    // Click on Taxes tab
    await page.click('button:has-text("Taxes")');
    await page.waitForTimeout(1000);
    console.log('Clicked on Taxes tab');
    
    // Validate Enable Tax Calculations heading is visible
    const enableTaxHeading = page.locator('h4:has-text("Enable Tax Calculations")');
    await expect(enableTaxHeading).toBeVisible();
    console.log('Enable Tax Calculations heading validated');
    
    // Check if tax calculations is already enabled
    const taxToggle = page.locator('.crlms-tax-enable-switcher .crlms-switcher-wrapper .components-form-toggle .components-form-toggle__input').first();
    const isTaxEnabled = await taxToggle.isChecked();
    console.log(`Tax calculations is ${isTaxEnabled ? 'already enabled' : 'not enabled'}`);
    
    if (isTaxEnabled) {
      // Tax is already enabled, skip toggling
      console.log('Tax calculations already enabled, skipping toggle action');
    } else {
      // Enable tax calculations
      await taxToggle.click();
      await page.waitForTimeout(2000);
      console.log('Tax calculations enabled');
    }
    
    // Validate Fallback Tax Rate heading is visible after enabling
    const fallbackTaxHeading = page.locator('h4:has-text("Fallback Tax Rate")');
    await expect(fallbackTaxHeading).toBeVisible();
    console.log('Fallback Tax Rate heading validated');
    
    // Enter 20 in Fallback Tax Rate input field
    const fallbackTaxInput = page.locator('input[placeholder="0.00"]').last();
    await fallbackTaxInput.click();
    await fallbackTaxInput.fill('20');
    console.log('Fallback Tax Rate set to 20');
    
    // Click on Save Changes button
    const saveChangesButton = page.locator('//button[normalize-space()="Save Changes"]');
    await saveChangesButton.click();
    await page.waitForTimeout(2000);
    console.log('Save Changes button clicked');
    
    // Validate success notification
    const successMessage = page.locator('text=Tax settings updated successfully.').first();
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    console.log('Tax settings updated successfully notification validated');
    
    // Scroll up to Dashboard element
    await page.locator('//div[normalize-space()="Dashboard"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    console.log('Scrolled up to Dashboard element');
    
    // Create a new course with price 15
    await page.waitForTimeout(3000);
    //await page.hover('//div[normalize-space()="Creator LMS"]');
    await page.click('//a[normalize-space()="Courses"]');
    await page.waitForTimeout(5000);
    await page.click('text=Add Course');
    await page.waitForTimeout(3000);
    console.log('Navigated to Add Course page');
    
    // Click on Start from Scratch
    await page.click('text=Start from Scratch');
    await page.waitForTimeout(3000);
    
    // Enter course title
    await page.fill('input[placeholder="Enter Course Title"]', 'Dashboard Count Test Course');
    console.log('Course title entered: Dashboard Count Test Course');
    
    // Click Next to go to Settings tab
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(3000);
    
    // Click on Paid radio button
    await page.getByRole('radio', { name: 'Paid' }).click();
    await page.waitForTimeout(3000);
    console.log('Selected Paid course type');
    
    // Set paid course price to 15
    await page.locator('//div[contains(@class, "crlms-price-range")]//input[@placeholder="0.00" and @type="number"]').first().fill('15');
    await page.waitForTimeout(3000);
    console.log('Course price set to 15');
    
    // Click Next to go to Preview
    await page.locator("//button[normalize-space()='Next']").click();
    await page.waitForTimeout(3000);
    
    // Publish the course
    await page.locator("//button[normalize-space()='Publish']").click();
    await page.waitForTimeout(3000);
    console.log('Course published successfully');
    
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
    expect(courseTitleText.trim()).toBe('Dashboard Count Test Course');
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
    
    // Validate Order Summary heading is visible
    const orderSummaryHeading = frontendPage.locator("//h3[normalize-space()='Order Summary']");
    await expect(orderSummaryHeading).toBeVisible();
    console.log('Order Summary heading is visible');
    
    // Validate the course title in order summary matches
    const orderCourseName = frontendPage.locator('text=Dashboard Count Test Course').first();
    await expect(orderCourseName).toBeVisible();
    const orderCourseNameText = await orderCourseName.textContent();
    expect(orderCourseNameText.trim()).toContain('Dashboard Count Test Course');
    console.log('Course title in order summary validated:', orderCourseNameText);
    
    // Validate tax percentage is matching with backend (20%)
    const taxPercentage = frontendPage.locator('.cart-tax-span').first();
    await expect(taxPercentage).toBeVisible({ timeout: 5000 });
    const taxPercentageText = await taxPercentage.textContent();
    expect(taxPercentageText.trim()).toContain('20%');
    console.log('Tax percentage validated:', taxPercentageText.trim());
    
    // Validate tax amount ($3.00 for 20% of $15.00)
    const taxAmount = frontendPage.locator('//tr[@class="cart-tax"]//td').last();
    await expect(taxAmount).toBeVisible({ timeout: 5000 });
    const taxAmountText = await taxAmount.textContent();
    expect(taxAmountText.trim()).toMatch(/3\.00|3/);
    console.log('Tax amount validated:', taxAmountText.trim());
    
    // Validate the total price with tax (20% tax on $15 = $18.00 total)
    const totalAmount = frontendPage.locator('//tr[@class="order-total"]//td').last();
    await expect(totalAmount).toBeVisible({ timeout: 5000 });
    const totalAmountText = await totalAmount.textContent();
    expect(totalAmountText.trim()).toMatch(/18\.00|18/);
    console.log('Total price with tax validated:', totalAmountText.trim());
    
    // Fill in the checkout form fields
    await frontendPage.getByRole('textbox', { name: 'Email *' }).fill('test@clms.co');
    await frontendPage.getByRole('textbox', { name: 'First Name *' }).fill('John');
    await frontendPage.getByRole('textbox', { name: 'Last Name *' }).fill('Doe');
    await frontendPage.getByRole('textbox', { name: 'Address *' }).fill('123 Main Street');
    console.log('Checkout form fields filled');
    
    // Click on Offline Payment radio button - use first() to target the first radiobox
    const offlinePaymentRadio = frontendPage.locator('.radiobox').first();
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
    await frontendPage.screenshot({ path: 'thank-you-page-dashboard.png', fullPage: true });
    console.log('Screenshot saved: thank-you-page-dashboard.png');
    
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
    
    // Validate if the order ID exists in the orders list - use more specific selector
    const orderRow = page.locator(`//tr[.//a[normalize-space()='#${orderIdTrimmed}']]`);
    await expect(orderRow).toBeVisible({ timeout: 10000 });
    console.log(`Order ID ${orderIdTrimmed} found in orders list`);
    
    // Validate Payment Method is Offline
    const paymentMethod = orderRow.locator("//span[contains(text(),'offline')]");
    await expect(paymentMethod).toBeVisible();
    const paymentMethodText = await paymentMethod.textContent();
    expect(paymentMethodText.trim().toLowerCase()).toContain('offline');
    console.log('Payment Method validated: Offline');
    
    // Validate Total amount is $18.00 (7th column - Total column)
    const orderTotalAmount = orderRow.locator('td').nth(7);
    await expect(orderTotalAmount).toBeVisible();
    const orderTotalAmountText = await orderTotalAmount.textContent();
    expect(orderTotalAmountText.trim()).toContain('$18.00');
    console.log('Total amount validated:', orderTotalAmountText.trim());
    
    // Validate Status is Completed
    const orderStatus = orderRow.locator("//span[contains(text(),'completed')] | //td[contains(text(),'completed')]");
    await expect(orderStatus).toBeVisible();
    const orderStatusText = await orderStatus.textContent();
    expect(orderStatusText.trim().toLowerCase()).toContain('completed');
    console.log('Order status validated: Completed');
    
    // Take final screenshot of Order Management page
    await page.screenshot({ path: 'order-management-dashboard.png', fullPage: true });
    console.log('Screenshot saved: order-management-dashboard.png');
    
    // Navigate back to Creator LMS Dashboard to validate updated counts
    await page.click('//div[normalize-space()="Creator LMS"]');
    await page.waitForTimeout(2000);
    console.log('Navigated back to Creator LMS Dashboard');
    
    // Store updated values from dashboard after purchase
    const updatedIncomeValue = await page.locator('.card-earning .crlms-card-value').textContent();
    console.log('Updated Income:', updatedIncomeValue.trim());
    
    const updatedRefundValue = await page.locator('.card-refund .crlms-card-value').textContent();
    console.log('Updated Refund:', updatedRefundValue.trim());
    
    const updatedNetIncomeValue = await page.locator('.card-net-income .crlms-card-value').textContent();
    console.log('Updated Net Income:', updatedNetIncomeValue.trim());
    
    const updatedCoursesSoldValue = await page.locator('.card-courses-sold .crlms-card-value').textContent();
    console.log('Updated Courses Sold:', updatedCoursesSoldValue.trim());
    
    const updatedEnrolleesValue = await page.locator('.card-students .crlms-card-value').textContent();
    console.log('Updated Enrollees:', updatedEnrolleesValue.trim());
    
    // Parse the numeric values from the strings
    const parseAmount = (value) => parseFloat(value.replace(/[^0-9.]/g, ''));
    
    const initialIncome = parseAmount(incomeValue);
    const updatedIncome = parseAmount(updatedIncomeValue);
    const expectedIncomeIncrease = 18.00;
    
    const initialNetIncome = parseAmount(netIncomeValue);
    const updatedNetIncome = parseAmount(updatedNetIncomeValue);
    
    const initialCoursesSold = parseInt(coursesSoldValue.replace(/[^0-9]/g, ''));
    const updatedCoursesSold = parseInt(updatedCoursesSoldValue.replace(/[^0-9]/g, ''));
    
    // Validate Refund value remains the same
    expect(updatedRefundValue.trim()).toBe(refundValue.trim());
    console.log('✓ Refund value remains unchanged');
    
    // Validate Income increased by $18.00
    expect(updatedIncome).toBe(initialIncome + expectedIncomeIncrease);
    console.log(`✓ Income increased by $${expectedIncomeIncrease} (from $${initialIncome} to $${updatedIncome})`);
    
    // Validate Net Income increased by $18.00
    expect(updatedNetIncome).toBe(initialNetIncome + expectedIncomeIncrease);
    console.log(`✓ Net Income increased by $${expectedIncomeIncrease} (from $${initialNetIncome} to $${updatedNetIncome})`);
    
    // Validate Total Sales (Courses Sold) increased by 1
    expect(updatedCoursesSold).toBe(initialCoursesSold + 1);
    console.log(`✓ Courses Sold increased by 1 (from ${initialCoursesSold} to ${updatedCoursesSold})`);
    
    // Navigate back to Orders page to check for unique students
    await page.hover('text=Creator LMS');
    await page.waitForTimeout(1000);
    await page.click("//a[normalize-space()='Orders']");
    await page.waitForTimeout(2000);
    console.log('Navigated back to Orders page to validate enrollees');
    
    // Get all order rows to count unique student email addresses
    const allOrderRows = await page.locator('//table//tbody//tr').all();
    const studentEmails = new Set();
    
    for (const row of allOrderRows) {
      try {
        // Find the Student column (usually the 4th column based on the screenshot)
        const studentEmail = await row.locator('td').nth(3).textContent();
        if (studentEmail && studentEmail.trim()) {
          studentEmails.add(studentEmail.trim());
        }
      } catch (e) {
        // Skip if column not found
        console.log('Could not extract student email from a row');
      }
    }
    
    const uniqueStudentCount = studentEmails.size;
    console.log(`Unique student emails found: ${uniqueStudentCount}`, Array.from(studentEmails));
    
    const initialEnrollees = parseInt(enrolleesValue.replace(/[^0-9]/g, ''));
    const updatedEnrollees = parseInt(updatedEnrolleesValue.replace(/[^0-9]/g, ''));
    
    // Validate Enrollees count matches unique student emails count
    expect(updatedEnrollees).toBe(uniqueStudentCount);
    console.log(`✓ Enrollees count validated: Dashboard shows ${updatedEnrollees}, Unique emails in orders: ${uniqueStudentCount}`);
    
    // Navigate to Settings > Payments > Taxes to disable tax calculations
    await page.hover('text=Creator LMS');
    await page.click('text=Settings');
    await page.waitForTimeout(2000);
    console.log('Navigated to Settings');
    
    // Click on Payments tab
    await page.click('button:has-text("Payments")');
    await page.waitForTimeout(1000);
    console.log('Clicked on Payments tab');
    
    // Click on Taxes tab
    await page.click('button:has-text("Taxes")');
    await page.waitForTimeout(1000);
    console.log('Clicked on Taxes tab');
    
    // Disable tax calculations by clicking the toggle
    const taxToggleDisable = page.locator('.crlms-tax-enable-switcher .crlms-switcher-wrapper .components-form-toggle .components-form-toggle__input').first();
    const isTaxEnabledNow = await taxToggleDisable.isChecked();
    
    if (isTaxEnabledNow) {
      await taxToggleDisable.click();
      await page.waitForTimeout(2000);
      console.log('Tax calculations disabled');
    } else {
      console.log('Tax calculations already disabled');
    }
    
    // Click on Save Changes button
    const saveChangesButtonFinal = page.locator('//button[normalize-space()="Save Changes"]');
    await saveChangesButtonFinal.click();
    await page.waitForTimeout(2000);
    console.log('Save Changes button clicked');
    
    // Take screenshot after disabling tax
    await page.screenshot({ path: 'tax-disabled.png', fullPage: true });
    console.log('Screenshot saved: tax-disabled.png');
    
    console.log('✅ Dashboard count validation completed successfully');
  });
});
