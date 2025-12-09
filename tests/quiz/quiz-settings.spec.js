import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test.describe('Quiz Settings - Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to WordPress login page
    await page.goto(adminLoginURL);
    
    // Login to WordPress
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    
    console.log('✅ Successfully logged into WordPress Dashboard');
  });

  test('should validate quiz settings configuration', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    console.log('\n🧪 TEST: Quiz Settings Validation');
    
    // Step 1: Navigate to Creator LMS Courses
    await page.waitForTimeout(2000);
    const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.waitFor({ state: 'visible', timeout: 10000 });
    await creatorLmsMenu.click();
    
    const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.waitFor({ state: 'visible', timeout: 10000 });
    await coursesSubmenu.click();
    await page.waitForTimeout(3000);
    
    // Step 2: Click "Add Course"
    const createCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await createCourseButton.click();
    await page.waitForTimeout(3000);
    
    // Step 3: Select "Start from Scratch"
    const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await page.waitForTimeout(3000);
    
    // Step 4: Fill course title
    const courseTitleInput = page.locator("input[placeholder='Enter Course Title']");
    await courseTitleInput.fill('Quiz Settings Test Course');
    await page.waitForTimeout(2000);
    
    // Step 5: Fill chapter title
    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Settings Test Chapter');
    await page.waitForTimeout(2000);
    
    // Step 6: Click "Add Content" button
    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);
    
    // Step 7: Click Quiz option
    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);
    
    // Step 8: Fill quiz title
    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Settings Validation Quiz');
    await page.waitForTimeout(2000);
    console.log('📝 Created quiz with title: "Settings Validation Quiz"');
    
    // Step 9: Navigate to Classic tab
    const classicTab = page.getByRole('tab', { name: 'Classic' });
    await classicTab.click();
    await page.waitForTimeout(2000);
    
    // Step 10: Drag Single Choice question type to drop area
    const singleChoiceType = page.locator("//div[@class='crlms-quiz-blocks-wrapper crlms-quiz-blocks-wrapper-classic']//div[@aria-label='Quiz: Single Choice']//div[@class='crlms-quiz-block-icon']");
    const dragDropArea = page.getByText('Drag & DropDrag and drop a');
    await expect(singleChoiceType).toBeVisible({ timeout: 5000 });
    await expect(dragDropArea).toBeVisible({ timeout: 5000 });
    await singleChoiceType.dragTo(dragDropArea);
    await page.waitForTimeout(2000);
    console.log('✅ Dragged Single Choice question type to quiz');
    
    // Step 11: Fill question text
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('What is 2 + 2?');
    await page.waitForTimeout(2000);
    
    // Step 12: Fill first option
    const firstOption = page.getByPlaceholder('Option 1');
    await firstOption.click();
    await firstOption.fill('4');
    await page.waitForTimeout(1000);
    
    // Step 13: Fill second option
    const secondOption = page.getByPlaceholder('Option 2');
    await secondOption.click();
    await secondOption.fill('5');
    await page.waitForTimeout(1000);
    
    // Step 14: Select first option as correct answer
    const firstRadioButton = page.locator('input[type="radio"]').first();
    await firstRadioButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ Created single choice question with correct answer');
    
    await page.screenshot({ path: 'before-settings.png', fullPage: true });
    
    // Step 15: Click on Settings button from top
    console.log('🔍 Clicking Settings button from top...');
    const settingsButton = page.locator("//button[@class='components-button crlms-preview-btn crlms-action-button crlms-quiz-settings-btn-header has-text has-icon']");
    await settingsButton.click();
    await page.waitForTimeout(2000);
    console.log('✅ Clicked Settings button');
    
    // Step 16: Validate "Settings" title is visible
    console.log('🔍 Validating Settings title...');
    const settingsTitle = page.locator("//h4[normalize-space()='Settings']");
    await expect(settingsTitle).toBeVisible({ timeout: 10000 });
    console.log('✅ "Settings" title is visible');
    
    await page.screenshot({ path: 'settings-page.png', fullPage: true });
    
    // Step 17: Click on Time Limit input field (unique customized locator without ID)
    console.log('🔍 Clicking Time Limit input field...');
    // Using text "Time Limit" and finding the nearby input with type="number"
    const timeLimitInput = page.locator("input[type='number'][inputmode='numeric']").first();
    await timeLimitInput.click();
    await page.waitForTimeout(1000);
    
    // Step 18: Provide input as 1
    await timeLimitInput.fill('1');
    await page.waitForTimeout(1000);
    console.log('✅ Entered "1" in Time Limit input field');
    
    // Step 19: Validate "Minutes" is visible beside the input field
    console.log('🔍 Validating "Minutes" dropdown is visible...');
    const minutesDropdown = page.locator("select.components-select-control__input").first();
    await expect(minutesDropdown).toBeVisible({ timeout: 5000 });
    console.log('✅ "Minutes" dropdown is visible beside Time Limit input');
    
    await page.screenshot({ path: 'time-limit-set.png', fullPage: true });
    
    // // Step 20: Click on Set Passing Grade toggle icon
    // console.log('🔍 Clicking Set Passing Grade toggle...');
    // await page.waitForTimeout(2000);
    // // Click the checkbox input for Set Passing Grade (count checkboxes: Drip=0, Set Passing Grade=1)
    // const passingGradeToggle = page.locator('input[type="checkbox"][role="switch"]').nth(1);
    // await passingGradeToggle.click();
    // await page.waitForTimeout(2000);
    // console.log('✅ Clicked Set Passing Grade toggle');
    
    // await page.screenshot({ path: 'passing-grade-toggle.png', fullPage: true });
    
    // // Step 21: Validate input field appears below and click on it
    // console.log('🔍 Clicking Passing Grade percentage input field...');
    // // The passing grade input appears after clicking the toggle (second number input on page)
    // const passingGradeInput = page.locator("input[type='number'][inputmode='numeric']").nth(1);
    // await expect(passingGradeInput).toBeVisible({ timeout: 5000 });
    // await passingGradeInput.click();
    // await page.waitForTimeout(1000);
    
    // // Step 22: Provide input as 1
    // await passingGradeInput.fill('1');
    // await page.waitForTimeout(1000);
    // console.log('✅ Entered "1" in Passing Grade input field');
    
    // await page.screenshot({ path: 'passing-grade-set.png', fullPage: true });
    
    // Step 23: Click on Attempts Allowed input field (unique customized locator without ID)
    console.log('🔍 Clicking Attempts Allowed input field...');
    // Attempts Allowed is the second number input when passing grade is disabled
    const attemptsAllowedInput = page.locator("input[type='number'][inputmode='numeric']").nth(1);
    await attemptsAllowedInput.click();
    await page.waitForTimeout(1000);
    
    // Step 24: Provide input as 3
    await attemptsAllowedInput.fill('3');
    await page.waitForTimeout(1000);
    console.log('✅ Entered "3" in Attempts Allowed input field');
    
    await page.screenshot({ path: 'attempts-allowed-set.png', fullPage: true });
    
    // Step 25: Validate all values are set correctly
    console.log('🔍 Validating all settings values...');
    
    const timeLimitValue = await timeLimitInput.inputValue();
    //const passingGradeValue = await passingGradeInput.inputValue();
    const attemptsAllowedValue = await attemptsAllowedInput.inputValue();
    
    expect(timeLimitValue).toBe('1');
    //expect(passingGradeValue).toBe('1');
    expect(attemptsAllowedValue).toBe('3');
    
    console.log('✅ VALIDATION PASSED: Quiz settings configured successfully');
    console.log('   Settings configured:');
    console.log(`   - Time Limit: ${timeLimitValue} Minutes`);
    //console.log(`   - Set Passing Grade: ${passingGradeValue}%`);
    console.log(`   - Attempts Allowed: ${attemptsAllowedValue}`);
    
    await page.screenshot({ path: 'quiz-settings-complete.png', fullPage: true });
    
    // Step 26: Click Save button
    console.log('🔍 Clicking Save button...');
    const saveButton = page.locator("//button[normalize-space()='Save']");
    await saveButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Save button');
    
    // Step 27: Click Preview button and validate in new tab
    console.log('🔍 Clicking Preview button...');
    const [previewPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator("//button[@class='components-button crlms-preview-btn crlms-action-button crlms-quiz-preview-btn-header has-text has-icon']").click()
    ]);
    await previewPage.waitForLoadState('load');
    await page.waitForTimeout(2000);
    console.log('✅ Preview page opened in new tab');
    
    // Step 28: Validate quiz title in preview tab
    console.log('🔍 Validating quiz title in preview page...');
    const quizTitle = 'Settings Validation Quiz';
    const previewQuizTitle = previewPage.getByRole('heading', { name: quizTitle, level: 1 });
    await expect(previewQuizTitle).toBeVisible({ timeout: 10000 });
    console.log(`✅ Quiz title "${quizTitle}" is visible in preview page`);
    
    await previewPage.screenshot({ path: 'quiz-preview-validation.png', fullPage: true });
    
    // Close preview tab
    await previewPage.close();
    console.log('✅ Closed preview tab');
    
    // Step 29: Validate we are back to quiz window
    console.log('🔍 Validating back to quiz window...');
    const quizHeading = page.getByRole('heading', { name: 'Quiz', level: 1 });
    await expect(quizHeading).toBeVisible({ timeout: 5000 });
    console.log('✅ Back to quiz window confirmed');
    
    // Step 30: Click cross (close) icon from top right
    console.log('🔍 Clicking close icon from top right...');
    const closeButton = page.getByRole('button', { name: 'Close' });
    await closeButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked close button');
    
    // Step 31: Validate quiz exists under the chapter
    console.log('🔍 Validating quiz exists under chapter...');
    const savedQuizName = page.getByText('Settings Validation Quiz');
    await expect(savedQuizName).toBeVisible({ timeout: 10000 });
    console.log('✅ Quiz "Settings Validation Quiz" is visible under the chapter');
    
    await page.screenshot({ path: 'quiz-saved-under-chapter.png', fullPage: true });
  });
});
