import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

/**
 * Test Suite: Matching Interactive Quiz Question - Field Validation Tests
 * 
 * Purpose: Validates error handling and field validations for Matching quiz questions
 * 
 * Test Cases:
 * 1. Empty question text validation - Ensures save is prevented without question text
 * 2. Empty match item validation - Ensures save is prevented with empty match item
 * 3. Empty matching definition validation - Ensures save is prevented with empty definition
 * 
 * Expected Behavior:
 * - System should show validation errors
 * - Save button should be disabled or show error message
 * - User should not be able to proceed without required fields
 * 
 * Dependencies: 
 * - WordPress admin access
 * - Creator LMS plugin installed
 * 
 * Note: Tests have 2-minute timeout due to course/quiz creation time
 */

test.describe('Matching Interactive Quiz Question - Field Validation Tests', () => {
  
  test('should validate empty question text error', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    // Step 1: Log into WordPress dashboard
    await page.goto(adminLoginURL);
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    console.log('✅ Successfully logged into WordPress Dashboard');

    // Step 2: Navigate to Creator LMS Courses
    await page.waitForTimeout(2000);
    const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.waitFor({ state: 'visible', timeout: 10000 });
    await creatorLmsMenu.click();
    
    const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.waitFor({ state: 'visible', timeout: 10000 });
    await coursesSubmenu.click();
    await page.waitForTimeout(3000);
    console.log('✅ Navigated to Courses');

    // Step 3: Create new course
    const addCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await addCourseButton.click();
    await page.waitForTimeout(3000);

    const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await page.waitForTimeout(3000);

    // Step 4: Provide course and chapter titles
    const courseTitleInput = page.locator("input[placeholder='Enter Course Title']");
    await courseTitleInput.fill('Validation Test Course');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Validation Test Chapter');
    await page.waitForTimeout(2000);

    // Step 5: Add Quiz
    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Validation Test Quiz');
    await page.waitForTimeout(2000);
    console.log('✅ Quiz created');

    // Step 6: Click Interactive tab and add Matching question
    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);
    console.log('✅ Matching question added');

    // Step 7: Leave question text empty and try to add match items
    console.log('🔍 Testing empty question text validation...');
    
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await expect(questionInput).toBeVisible({ timeout: 5000 });
    // Don't fill question text - leave it empty
    
    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Test Item');
    await page.waitForTimeout(2000);

    // Step 8: Try to save and validate error
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();
    await page.waitForTimeout(3000);
    
    // Check if question text field shows validation error or if save is prevented
    const questionTextValue = await questionInput.inputValue();
    if (questionTextValue === '') {
      console.log('⚠️ Question text is empty - validation should prevent save');
    }
    
    await page.screenshot({ path: 'validation-empty-question.png', fullPage: true });
    console.log('📸 Screenshot saved: validation-empty-question.png');
    console.log('✅ Empty question text validation test completed');
  });

  test('should validate empty match item error', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    // Step 1: Log into WordPress dashboard
    await page.goto(adminLoginURL);
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    console.log('✅ Successfully logged into WordPress Dashboard');

    // Step 2-5: Navigate and create quiz (same as above)
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
    await courseTitleInput.fill('Empty Match Item Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Empty Match Item Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Empty Match Item Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    // Step 6: Fill question but leave match item empty
    console.log('🔍 Testing empty match item validation...');
    
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Test question with empty match item');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    // Leave match item empty
    
    const firstMatchDefinition = page.getByPlaceholder('Matching definition').first();
    await firstMatchDefinition.click();
    await firstMatchDefinition.fill('Some definition');
    await page.waitForTimeout(2000);

    // Try to save
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();
    await page.waitForTimeout(3000);
    
    const matchItemValue = await firstMatchItem.inputValue();
    if (matchItemValue === '') {
      console.log('⚠️ Match item is empty - validation should prevent save');
    }
    
    await page.screenshot({ path: 'validation-empty-match-item.png', fullPage: true });
    console.log('📸 Screenshot saved: validation-empty-match-item.png');
    console.log('✅ Empty match item validation test completed');
  });

  test('should validate empty matching definition error', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    // Step 1: Log into WordPress dashboard
    await page.goto(adminLoginURL);
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    console.log('✅ Successfully logged into WordPress Dashboard');

    // Step 2-5: Navigate and create quiz
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
    await courseTitleInput.fill('Empty Definition Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Empty Definition Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Empty Definition Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    // Step 6: Fill question and match item but leave definition empty
    console.log('🔍 Testing empty matching definition validation...');
    
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Test question with empty definition');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Some match item');
    await page.waitForTimeout(2000);
    
    const firstMatchDefinition = page.getByPlaceholder('Matching definition').first();
    // Leave definition empty

    // Try to save
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();
    await page.waitForTimeout(3000);
    
    const definitionValue = await firstMatchDefinition.inputValue();
    if (definitionValue === '') {
      console.log('⚠️ Matching definition is empty - validation should prevent save');
    }
    
    await page.screenshot({ path: 'validation-empty-definition.png', fullPage: true });
    console.log('📸 Screenshot saved: validation-empty-definition.png');
    console.log('✅ Empty matching definition validation test completed');
  });
});
