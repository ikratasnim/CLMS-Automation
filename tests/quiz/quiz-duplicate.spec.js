import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test.describe('Single Choice Quiz - Duplicate/Copy Functionality', () => {
  
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

  test('should duplicate single choice quiz question with copy icon', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    console.log('\n🧪 TEST: Duplicate Single Choice Quiz Question Functionality');
    
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
    await courseTitleInput.fill('Single Choice Duplicate Test Course');
    await page.waitForTimeout(2000);
    
    // Step 5: Fill chapter title
    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Duplicate Test Chapter');
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
    await quizTitleInput.fill('Duplicate Test Quiz');
    await page.waitForTimeout(2000);
    console.log('📝 Created quiz with title: "Duplicate Test Quiz"');
    
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
    const originalQuestion = 'What is the largest planet in our solar system?';
    await questionInput.click();
    await questionInput.fill(originalQuestion);
    await page.waitForTimeout(2000);
    console.log(`📝 Original question: "${originalQuestion}"`);
    
    // Step 12: Fill first option
    const firstOption = page.getByPlaceholder('Option 1');
    const originalOption1 = 'Jupiter';
    await firstOption.click();
    await firstOption.fill(originalOption1);
    await page.waitForTimeout(1000);
    
    // Step 13: Fill second option
    const secondOption = page.getByPlaceholder('Option 2');
    const originalOption2 = 'Saturn';
    await secondOption.click();
    await secondOption.fill(originalOption2);
    await page.waitForTimeout(1000);
    console.log(`📝 Original options: "${originalOption1}", "${originalOption2}"`);
    
    // Step 14: Select first option as correct answer
    const firstRadioButton = page.locator('input[type="radio"]').first();
    await firstRadioButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ Selected first option as correct answer');
    
    // Step 15: Store original values for validation
    const storedQuestion = await questionInput.inputValue();
    const storedOption1 = await firstOption.inputValue();
    const storedOption2 = await secondOption.inputValue();
    console.log('💾 Stored original values:');
    console.log(`   Question: "${storedQuestion}"`);
    console.log(`   Option 1: "${storedOption1}"`);
    console.log(`   Option 2: "${storedOption2}"`);
    
    await page.screenshot({ path: 'before-duplicate.png', fullPage: true });
    
    // Step 16: Click the copy icon button
    console.log('🔍 Clicking copy icon to duplicate question...');
    const copyButton = page.locator("//button[@class='components-button crlms-copy-btn has-icon']//*[name()='svg']");
    await copyButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked copy icon');
    
    // Step 17: Validate that Question 02 appears
    console.log('🔍 Validating Question 02 appeared...');
    const question02 = page.locator("//p[normalize-space()='02']");
    await expect(question02).toBeVisible({ timeout: 10000 });
    console.log('✅ Question 02 appeared after clicking copy icon');
    
    await page.screenshot({ path: 'after-duplicate.png', fullPage: true });
    
    // Step 18: Click on Question 02
    console.log('🔍 Clicking on Question 02...');
    await question02.click();
    await page.waitForTimeout(2000);
    console.log('✅ Clicked on Question 02');
    
    // Step 19: Validate all values in Question 02 match original values
    console.log('🔍 Validating duplicated question values...');
    
    // Get values from Question 02
    const duplicatedQuestionInput = page.getByRole('textbox', { name: 'Type your question here' });
    const duplicatedOption1 = page.getByPlaceholder('Option 1');
    const duplicatedOption2 = page.getByPlaceholder('Option 2');
    
    const duplicatedQuestion = await duplicatedQuestionInput.inputValue();
    const duplicatedOpt1 = await duplicatedOption1.inputValue();
    const duplicatedOpt2 = await duplicatedOption2.inputValue();
    
    console.log('📋 Duplicated values:');
    console.log(`   Question: "${duplicatedQuestion}"`);
    console.log(`   Option 1: "${duplicatedOpt1}"`);
    console.log(`   Option 2: "${duplicatedOpt2}"`);
    
    // Step 20: Validate that duplicated values match original values
    expect(duplicatedQuestion).toBe(storedQuestion);
    expect(duplicatedOpt1).toBe(storedOption1);
    expect(duplicatedOpt2).toBe(storedOption2);
    
    console.log('✅ VALIDATION PASSED: Duplicate functionality works perfectly');
    console.log('   - Question text matches original');
    console.log('   - Option 1 matches original');
    console.log('   - Option 2 matches original');
    console.log('   - Question 02 was successfully created');
    
    await page.screenshot({ path: 'duplicate-validation-complete.png', fullPage: true });
  });
});
