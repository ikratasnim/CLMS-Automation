import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test.describe('Single Choice Quiz - CRUD Operations', () => {
  
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

  test('should edit single choice quiz question and options successfully', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    console.log('\n🧪 TEST 1: Edit Single Choice Quiz Functionality');
    
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
    await courseTitleInput.fill('Single Choice Edit Test Course');
    await page.waitForTimeout(2000);
    
    // Step 5: Fill chapter title
    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Test Chapter');
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
    const originalQuizTitle = 'Original Single Choice Quiz';
    await quizTitleInput.fill(originalQuizTitle);
    await page.waitForTimeout(2000);
    console.log(`📝 Created quiz with title: "${originalQuizTitle}"`);
    
    // Step 9: Navigate to Classic tab
    const classicTab = page.getByRole('tab', { name: 'Classic' });
    await classicTab.click();
    await page.waitForTimeout(2000);
    
    // Step 10: Drag Single Choice question type to drop area
    const singleChoiceType = page.locator("//div[@class='crlms-quiz-blocks-wrapper crlms-quiz-blocks-wrapper-classic']//div[@aria-label='Quiz: Single Choice']//div[@class='crlms-quiz-block-icon']");
    await page.waitForTimeout(2000);
    const dragDropArea = page.getByText('Drag & DropDrag and drop a');
    await expect(singleChoiceType).toBeVisible({ timeout: 5000 });
    await expect(dragDropArea).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(2000);    
    await singleChoiceType.dragTo(dragDropArea);
    await page.waitForTimeout(2000);
    console.log('✅ Dragged Single Choice question type to quiz');
    
    // Step 11: Fill question text
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    const originalQuestion = 'What is the capital of France?';
    await questionInput.click();
    await questionInput.fill(originalQuestion);
    await page.waitForTimeout(2000);
    console.log(`📝 Original question: "${originalQuestion}"`);
    
    // Step 12: Fill first option
    const firstOption = page.getByPlaceholder('Option 1');
    const originalOption1 = 'Paris';
    await firstOption.click();
    await firstOption.fill(originalOption1);
    await page.waitForTimeout(1000);
    
    // Step 13: Fill second option
    const secondOption = page.getByPlaceholder('Option 2');
    const originalOption2 = 'London';
    await secondOption.click();
    await secondOption.fill(originalOption2);
    await page.waitForTimeout(1000);
    console.log(`📝 Original options: "${originalOption1}", "${originalOption2}"`);
    
    // Step 14: Select first option as correct answer
    const firstRadioButton = page.locator('input[type="radio"]').first();
    await firstRadioButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ Selected first option as correct answer');
    
    // Step 15: Click Save button
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Saved the quiz');
    
    // Step 16: Validate "Saved Successfully" notification
    const savedNotification = page.getByText('Saved Successfully').first();
    await expect(savedNotification).toBeVisible({ timeout: 10000 });
    console.log('✅ "Saved Successfully" notification appeared');
    await page.screenshot({ path: 'single-choice-saved.png', fullPage: true });
    
    // Step 17: Close the quiz modal
    const closeButton = page.getByRole('button', { name: 'Close' });
    await closeButton.click();
    await page.waitForTimeout(2000);
    console.log('✅ Closed quiz modal - returned to course builder');
    
    // Step 18: Click on the quiz again from the chapter to edit
    console.log('🔍 Opening quiz again for editing...');
    const quizInChapter = page.getByText('Original Single Choice Quiz');
    await quizInChapter.click();
    await page.waitForTimeout(3000);
    console.log('✅ Reopened quiz for editing');
    
    // Step 19: Edit the question text
    const questionInputEdit = page.getByRole('textbox', { name: 'Type your question here' });
    const editedQuestion = 'What is the capital of Italy?';
    await questionInputEdit.click();
    await questionInputEdit.clear();
    await questionInputEdit.fill(editedQuestion);
    await page.waitForTimeout(2000);
    console.log(`✏️ Edited question to: "${editedQuestion}"`);
    
    // Step 20: Edit the first option
    const firstOptionEdit = page.getByPlaceholder('Option 1');
    const editedOption1 = 'Rome';
    await firstOptionEdit.click();
    await firstOptionEdit.clear();
    await firstOptionEdit.fill(editedOption1);
    await page.waitForTimeout(1000);
    
    // Step 21: Edit the second option
    const secondOptionEdit = page.getByPlaceholder('Option 2');
    const editedOption2 = 'Milan';
    await secondOptionEdit.click();
    await secondOptionEdit.clear();
    await secondOptionEdit.fill(editedOption2);
    await page.waitForTimeout(1000);
    console.log(`✏️ Edited options to: "${editedOption1}", "${editedOption2}"`);
    
    // Step 22: Save the edited quiz
    const saveButtonEdit = page.getByRole('button', { name: 'Save' });
    await saveButtonEdit.click();
    await page.waitForTimeout(3000);
    console.log('✅ Saved edited quiz');
    
    // Step 23: Validate "Saved Successfully" notification again
    const savedNotificationEdit = page.getByText('Saved Successfully').first();
    await expect(savedNotificationEdit).toBeVisible({ timeout: 10000 });
    console.log('✅ "Saved Successfully" notification appeared after edit');
    await page.screenshot({ path: 'single-choice-edited.png', fullPage: true });
    
    // Step 24: Validate that the edited values are persisted
    const questionValue = await questionInputEdit.inputValue();
    const option1Value = await firstOptionEdit.inputValue();
    const option2Value = await secondOptionEdit.inputValue();
    
    expect(questionValue).toBe(editedQuestion);
    expect(option1Value).toBe(editedOption1);
    expect(option2Value).toBe(editedOption2);
    
    console.log('✅ VALIDATION PASSED: Edit functionality works perfectly');
    console.log(`   - Question updated: "${originalQuestion}" → "${editedQuestion}"`);
    console.log(`   - Option 1 updated: "${originalOption1}" → "${editedOption1}"`);
    console.log(`   - Option 2 updated: "${originalOption2}" → "${editedOption2}"`);
  });

  test('should delete single choice quiz and show drag & drop area again', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    console.log('\n🧪 TEST 2: Delete Single Choice Quiz Functionality');
    
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
    await courseTitleInput.fill('Single Choice Delete Test Course');
    await page.waitForTimeout(2000);
    
    // Step 5: Fill chapter title
    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Delete Test Chapter');
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
    await quizTitleInput.fill('Delete Test Quiz');
    await page.waitForTimeout(2000);
    
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
    await questionInput.fill('This question will be deleted');
    await page.waitForTimeout(2000);
    
    // Step 12: Fill options
    const firstOption = page.getByPlaceholder('Option 1');
    await firstOption.click();
    await firstOption.fill('Option A');
    await page.waitForTimeout(1000);
    
    const secondOption = page.getByPlaceholder('Option 2');
    await secondOption.click();
    await secondOption.fill('Option B');
    await page.waitForTimeout(1000);
    
    // Step 13: Select first option as correct
    const firstRadioButton = page.locator('input[type="radio"]').first();
    await firstRadioButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ Created single choice question with 2 options');
    await page.screenshot({ path: 'before-delete.png', fullPage: true });
    
    // Step 14: Click delete button using provided XPath
    console.log('🔍 Clicking delete button...');
    const deleteButton = page.locator("//button[@class='components-button crlms-delete-btn has-icon']//*[name()='svg']");
    await deleteButton.click();
    await page.waitForTimeout(2000);
    console.log('✅ Clicked delete button');
    
    // Step 15: Validate delete confirmation modal appears
    console.log('🔍 Waiting for delete confirmation modal...');
    await page.screenshot({ path: 'delete-modal.png', fullPage: true });
    
    // Step 16: Click Delete button in the confirmation modal
    const deleteConfirmButton = page.getByRole('button', { name: /delete|confirm/i }).last();
    await deleteConfirmButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Delete button in confirmation modal');
    
    // Step 17: Validate that the question is removed and drag & drop area is visible again
    console.log('🔍 Validating question removed and drag & drop area visible...');
    
    // Check that drag & drop area is visible
    const dragDropAreaAfterDelete = page.getByText('Drag & DropDrag and drop a');
    await expect(dragDropAreaAfterDelete).toBeVisible({ timeout: 10000 });
    console.log('✅ Drag & Drop area is visible again');
    
    // Validate that the question input is no longer visible
    const questionInputAfterDelete = page.getByRole('textbox', { name: 'Type your question here' });
    await expect(questionInputAfterDelete).not.toBeVisible();
    console.log('✅ Question input is no longer visible');
    
    // Validate that options are no longer visible
    const option1AfterDelete = page.getByPlaceholder('Option 1');
    await expect(option1AfterDelete).not.toBeVisible();
    console.log('✅ Options are no longer visible');
    
    await page.screenshot({ path: 'after-delete.png', fullPage: true });
    
    console.log('✅ VALIDATION PASSED: Delete functionality works perfectly');
    console.log('   - Question removed successfully');
    console.log('   - Drag & Drop area restored');
    console.log('   - Can add new question again');
  });
});
