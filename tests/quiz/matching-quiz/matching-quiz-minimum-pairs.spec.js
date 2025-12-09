import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

/**
 * Test Suite: Matching Interactive Quiz Question - Minimum Pairs Validation
 * 
 * Purpose: Validates minimum pair requirement (cannot delete below 2 pairs)
 * 
 * Test Cases:
 * 1. Minimum pairs validation - Verify error message when trying to delete below 2 pairs
 * 
 * Test Flow:
 * - Login to WordPress
 * - Create course with chapter
 * - Add quiz with matching question
 * - Fill 2 matching pairs (minimum required)
 * - Click delete icon on one of the pairs
 * - Verify error message appears: "You must have at least 2 options"
 * 
 * Features Tested:
 * - Validation rules for minimum pair requirements
 * - Error message display
 * - Delete button functionality
 * 
 * Dependencies:
 * - WordPress admin access
 * - Creator LMS plugin installed
 * - Matching quiz questions with pairs
 * 
 * Note: Tests have 2-minute timeout for complex operations
 */

test.describe('Matching Interactive Quiz Question - Minimum Pairs Validation', () => {
  
  test('should validate minimum pairs (cannot delete below 2)', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    await page.goto(adminLoginURL);
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    console.log('✅ Successfully logged into WordPress Dashboard');

    await page.waitForTimeout(2000);
    const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.waitFor({ state: 'visible', timeout: 10000 });
    await creatorLmsMenu.click();
    
    const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.waitFor({ state: 'visible', timeout: 10000 });
    await coursesSubmenu.click();
    await page.waitForTimeout(3000);

    const addCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await addCourseButton.click();
    await page.waitForTimeout(3000);

    const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await page.waitForTimeout(3000);

    const courseTitleInput = page.locator("input[placeholder='Enter Course Title']");
    await courseTitleInput.fill('Minimum Pairs Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Minimum Pairs Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Minimum Pairs Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    // Fill question and default pairs
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Test minimum pairs validation');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Item 1');
    await page.waitForTimeout(1000);

    const firstMatchDefinition = page.getByPlaceholder('Matching definition').first();
    await firstMatchDefinition.click();
    await firstMatchDefinition.fill('Definition 1');
    await page.waitForTimeout(1000);

    const secondMatchItem = page.getByPlaceholder('Match Item').nth(1);
    await secondMatchItem.click();
    await secondMatchItem.fill('Item 2');
    await page.waitForTimeout(1000);

    const secondMatchDefinition = page.getByPlaceholder('Matching definition').nth(1);
    await secondMatchDefinition.click();
    await secondMatchDefinition.fill('Definition 2');
    await page.waitForTimeout(2000);

    console.log('✅ Created 2 matching pairs (minimum required)');
    await page.screenshot({ path: 'minimum-two-pairs.png', fullPage: true });

    // Click delete icon on one of the pairs (should show error message)
    console.log('🔍 Clicking delete icon on first pair...');
    await page.waitForTimeout(2000);
    
    // Use the XPath locator for the delete button
    const deleteButton = page.locator("//div[@class='components-modal__screen-overlay']//div[4]//div[1]//div[1]//button[1]//*[name()='svg']");
    await deleteButton.click();
    await page.waitForTimeout(2000);

    // Verify error message appears: "You must have at least 2 options"
    const errorMessage = page.getByText('You must have at least 2 options');
    const isErrorVisible = await errorMessage.isVisible();
    
    if (isErrorVisible) {
      console.log('✅ Error message displayed: "You must have at least 2 options"');
      await page.screenshot({ path: 'minimum-error-message.png', fullPage: true });
    } else {
      console.log('❌ Error message not found');
      await page.screenshot({ path: 'minimum-no-error.png', fullPage: true });
    }

    // Assert error message is visible
    await expect(errorMessage).toBeVisible();
    console.log('✅ Minimum pairs validation test completed - Error message verified');
  });
});
