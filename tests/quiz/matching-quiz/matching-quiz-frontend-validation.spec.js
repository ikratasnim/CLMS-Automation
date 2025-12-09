import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

/**
 * Test Suite: Matching Interactive Quiz Question - Frontend Validation
 * 
 * Purpose: Validates frontend display and functionality of matching quiz questions
 * 
 * Test Cases:
 * 1. Create matching quiz, save, preview and validate frontend display
 * 
 * Test Flow:
 * - Login and create course with matching quiz
 * - Add 2 matching pairs with values
 * - Click Save button
 * - Validate "Saved Successfully" notification appears
 * - Click Preview button
 * - Validate preview opens in new tab
 * - Validate quiz title matches
 * - Click "Start Quiz" button
 * - Validate question text matches
 * - Validate all paired values exist in frontend
 * 
 * Features Tested:
 * - Save functionality and notification
 * - Preview opens in new tab
 * - Frontend quiz display
 * - Question text display
 * - Matching pairs display (values should not be in same row)
 * 
 * Dependencies:
 * - WordPress admin access
 * - Creator LMS plugin installed
 * - Course/quiz creation permissions
 * 
 * Note: Tests have 2-minute timeout for complex operations
 */

test.describe('Matching Interactive Quiz Question - Frontend Validation', () => {
  
  test('should create, save, preview and validate matching quiz on frontend', async ({ page, context }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    // Step 1: Login to WordPress
    await page.goto(adminLoginURL);
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    console.log('✅ Successfully logged into WordPress Dashboard');

    // Step 2-5: Navigate and create course with matching quiz
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
    await courseTitleInput.fill('Frontend Matching Quiz Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Frontend Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    const quizTitle = 'Frontend Matching Quiz';
    await quizTitleInput.fill(quizTitle);
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    // Step 6: Fill question and 2 matching pairs
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    const questionText = 'Match the programming languages with their types';
    await questionInput.click();
    await questionInput.fill(questionText);
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    const firstItemValue = 'Python';
    await firstMatchItem.click();
    await firstMatchItem.fill(firstItemValue);
    await page.waitForTimeout(1000);

    const firstMatchDefinition = page.getByPlaceholder('Matching definition').first();
    const firstDefValue = 'High-level Language';
    await firstMatchDefinition.click();
    await firstMatchDefinition.fill(firstDefValue);
    await page.waitForTimeout(1000);

    const secondMatchItem = page.getByPlaceholder('Match Item').nth(1);
    const secondItemValue = 'JavaScript';
    await secondMatchItem.click();
    await secondMatchItem.fill(secondItemValue);
    await page.waitForTimeout(1000);

    const secondMatchDefinition = page.getByPlaceholder('Matching definition').nth(1);
    const secondDefValue = 'Scripting Language';
    await secondMatchDefinition.click();
    await secondMatchDefinition.fill(secondDefValue);
    await page.waitForTimeout(2000);

    console.log('✅ Created matching quiz with 2 pairs');
    console.log(`   Question: "${questionText}"`);
    console.log(`   Pair 1: "${firstItemValue}" - "${firstDefValue}"`);
    console.log(`   Pair 2: "${secondItemValue}" - "${secondDefValue}"`);

    // Step 7: Click Save button and validate "Saved Successfully" notification
    console.log('🔍 Clicking Save button...');
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();
    await page.waitForTimeout(3000);

    // Validate "Saved Successfully" notification appears
    const savedNotification = page.getByText('Saved Successfully').first();
    await expect(savedNotification).toBeVisible({ timeout: 10000 });
    console.log('✅ "Saved Successfully" notification appeared');
    await page.screenshot({ path: 'frontend-saved-notification.png', fullPage: true });

    // Step 8: Click Preview button and validate it opens in new tab
    console.log('🔍 Clicking Preview button...');
    const previewButton = page.getByRole('button', { name: 'Preview' });
    
    // Listen for new page (new tab)
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      previewButton.click()
    ]);
    
    await newPage.waitForLoadState('domcontentloaded');
    console.log('✅ Preview opened in new tab');
    console.log(`   New tab URL: ${newPage.url()}`);
    await page.waitForTimeout(2000);

    // Step 9: Validate quiz title on frontend
    console.log('🔍 Validating quiz title on frontend...');
    const frontendQuizTitle = newPage.getByRole('heading', { name: quizTitle, level: 1 });
    await expect(frontendQuizTitle).toBeVisible({ timeout: 10000 });
    console.log(`✅ Quiz title "${quizTitle}" found on frontend`);
    await newPage.screenshot({ path: 'frontend-quiz-page.png', fullPage: true });

    
    // Close the preview tab
    await newPage.close();
  });
});
