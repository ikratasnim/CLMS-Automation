import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

/**
 * Test Suite: Matching Interactive Quiz Question - Creation & Validation
 * 
 * Purpose: Validates the basic creation workflow for Matching type quiz questions
 * 
 * Coverage:
 * - Login to WordPress dashboard
 * - Navigate to Creator LMS Courses
 * - Create new course and chapter
 * - Add quiz with matching question type
 * - Fill question text and matching pairs
 * - Add third matching pair using "Add Option" button
 * - Update score
 * - Take screenshots for documentation
 * 
 * Dependencies: 
 * - WordPress admin access
 * - Creator LMS plugin installed
 * - Media library with images
 */

test.describe('Matching Interactive Quiz Question - Creation & Validation', () => {
  
  test('should validate matching question creation workflow', async ({ page }) => {
    
    // Step 1: Log into WordPress dashboard
    await page.goto(adminLoginURL);
    
    // Fill in username and password
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');

    // Wait for navigation to wp-admin
    await page.waitForURL('**/wp-admin/**');

    // Assert that the admin bar is visible (login successful)
    await expect(page.locator('#wpadminbar')).toBeVisible();
    console.log('✅ Successfully logged into WordPress Dashboard');

    // Step 2: Navigate to Creator LMS Courses
    await page.waitForTimeout(2000); // Wait for page to stabilize
    
    // Try direct click on Creator LMS menu
    const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.waitFor({ state: 'visible', timeout: 10000 });
    await creatorLmsMenu.click();
    
    // Wait for submenu and click Courses
    const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.waitFor({ state: 'visible', timeout: 10000 });
    await coursesSubmenu.click();
    await page.waitForTimeout(3000);
    console.log('✅ Hovered on Creator LMS and clicked on Courses');

    // Step 3: Click on Add Courses
    const addCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await addCourseButton.click();
    await page.waitForTimeout(3000);

    // Click 'Start from Scratch' option
    const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked on Add Course and selected Start from Scratch');

    // Step 4: Provide course title
    const courseTitlePlaceholder = page.locator("input[placeholder='Enter Course Title']");
    await expect(courseTitlePlaceholder).toBeVisible();
    
    const courseTitle = 'Matching Interactive Quiz Course - Testing Functionality';
    await courseTitlePlaceholder.click();
    await courseTitlePlaceholder.fill(courseTitle);
    
    // Validate course title is entered
    const enteredTitle = await courseTitlePlaceholder.inputValue();
    expect(enteredTitle).toBe(courseTitle);
    console.log('✅ Course title provided:', courseTitle);

    // Step 5: Provide chapter title
    const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
    await chapterNamePlaceholder.click();
    
    const chapterTitle = 'Matching Interactive Testing Chapter';
    await chapterNamePlaceholder.fill(chapterTitle);
    
    // Validate chapter title is entered
    const enteredChapterName = await chapterNamePlaceholder.inputValue();
    expect(enteredChapterName).toBe(chapterTitle);
    console.log('✅ Chapter title provided:', chapterTitle);

    // Step 6: Click on Add Content and select Quiz
    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked on Add Content button');

    // Validate if 'Add Content' window is visible
    const addContentHeading = page.locator("h1", { hasText: 'Add Content' });
    await expect(addContentHeading).toBeVisible();
    console.log('✅ Add Content window opened successfully');

    // Select Quiz from Add Content window
    const quizTypeComponent = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizTypeComponent.click();
    await page.waitForTimeout(3000);
    console.log('✅ Selected Quiz from Add Content window');

    // Step 7: Validate Quiz window opened and h1 title is "Quiz"
    const quizHeading = page.getByRole('heading', { name: 'Quiz' });
    await expect(quizHeading).toBeVisible();
    console.log('✅ Quiz window opened successfully');
    console.log('✅ Validated h1 title is "Quiz"');

    // Step 8: Click on Enter Quiz Title placeholder and provide title
    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await expect(quizTitleInput).toBeVisible();
    await quizTitleInput.click();
    
    const quizTitle = 'Matching Interactive Knowledge Assessment Quiz';
    await quizTitleInput.fill(quizTitle);
    
    // Validate quiz title is entered
    const enteredQuizTitle = await quizTitleInput.inputValue();
    expect(enteredQuizTitle).toBe(quizTitle);
    console.log('✅ Quiz title provided:', quizTitle);

    // Step 9: Click on Add Quiz description placeholder and provide description
    const quizDescriptionInput = page.getByRole('textbox', { name: 'Add Quiz description' });
    await expect(quizDescriptionInput).toBeVisible();
    await quizDescriptionInput.click();
    
    const quizDescription = 'This interactive quiz tests your knowledge using matching questions. Match the items with their correct definitions to demonstrate your understanding of the subject matter.';
    await quizDescriptionInput.fill(quizDescription);
    
    // Validate quiz description is entered
    const enteredQuizDescription = await quizDescriptionInput.inputValue();
    expect(enteredQuizDescription).toBe(quizDescription);
    console.log('✅ Quiz description provided:', quizDescription);

    // Step 10: Click on Interactive tab
    console.log('🔍 Clicking on Interactive tab...');
    
    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await expect(interactiveTab).toBeVisible({ timeout: 5000 });
    await interactiveTab.click();
    await page.waitForTimeout(3000);
    console.log('✅ Successfully clicked on Interactive tab');
    
    // Take screenshot after clicking Interactive tab
    await page.screenshot({ path: 'matching-interactive-tab-clicked.png', fullPage: true });
    console.log('📸 Screenshot saved: matching-interactive-tab-clicked.png');

    // Step 11: Drag and Drop Matching question type
    console.log('🔍 Starting Matching question validation...');
    
    // Wait for Interactive tab content to load
    await page.waitForTimeout(3000);
    
    // Locate Matching question type button in Interactive tab
    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    await expect(matchingType).toBeVisible({ timeout: 5000 });   
    console.log('✅ Matching question type is visible in Interactive tab');
    
    // Locate the drag & drop area for the new question
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await expect(matchingDragDropArea).toBeVisible({ timeout: 5000 });
    console.log('✅ Drag & Drop area is visible for new question');
    
    // Perform drag and drop operation
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(1000);
    console.log('✅ Successfully dragged Matching question to drag & drop area');
    
    // Take screenshot of Matching question added
    await page.screenshot({ path: 'matching-question-added.png', fullPage: true });
    console.log('📸 Screenshot saved: matching-question-added.png');
    
    console.log('🎉 Matching question drag & drop validation completed successfully!');

    // Step 12: Validate "Type your question here" is visible
    console.log('🔍 Validating "Type your question here" field visibility...');
    
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await expect(questionInput).toBeVisible({ timeout: 5000 });
    console.log('✅ "Type your question here" field is visible - drag and drop successful!');

    // Step 13: Fill question text for Matching question
    console.log('🔍 Adding question text for Matching question...');
    
    await questionInput.click();
    await page.waitForTimeout(3000);
    await questionInput.fill('Match the following programming languages with their primary use case:');
    await page.waitForTimeout(3000);
    console.log('✅ Matching question text entered successfully');

    // Step 14: Fill the first match item
    console.log('🔍 Adding first match item...');
    
    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await expect(firstMatchItem).toBeVisible({ timeout: 5000 });
    await firstMatchItem.click();
    await page.waitForTimeout(2000);
    await firstMatchItem.fill('Python');
    await page.waitForTimeout(2000);
    console.log('✅ First match item entered successfully: "Python"');

    // Step 15: Fill the first matching definition
    console.log('🔍 Adding first matching definition...');
    
    const firstMatchDefinition = page.getByPlaceholder('Matching definition').first();
    await expect(firstMatchDefinition).toBeVisible({ timeout: 5000 });
    await firstMatchDefinition.click();
    await page.waitForTimeout(2000);
    await firstMatchDefinition.fill('Data Science and Machine Learning');
    await page.waitForTimeout(2000);
    console.log('✅ First matching definition entered successfully: "Data Science and Machine Learning"');

    // Step 16: Fill the second match item
    console.log('🔍 Adding second match item...');
    
    const secondMatchItem = page.getByPlaceholder('Match Item').nth(1);
    await expect(secondMatchItem).toBeVisible({ timeout: 5000 });
    await secondMatchItem.click();
    await page.waitForTimeout(2000);
    await secondMatchItem.fill('JavaScript');
    await page.waitForTimeout(2000);
    console.log('✅ Second match item entered successfully: "JavaScript"');

    // Step 17: Fill the second matching definition
    console.log('🔍 Adding second matching definition...');
    
    const secondMatchDefinition = page.getByPlaceholder('Matching definition').nth(1);
    await expect(secondMatchDefinition).toBeVisible({ timeout: 5000 });
    await secondMatchDefinition.click();
    await page.waitForTimeout(2000);
    await secondMatchDefinition.fill('Web Development and Frontend');
    await page.waitForTimeout(2000);
    console.log('✅ Second matching definition entered successfully: "Web Development and Frontend"');

    // Step 18: Click on Add Option button to add a third matching pair
    console.log('🔍 Clicking on Add Option button...');
    
    const addOptionButton = page.getByRole('button', { name: 'Add Option' });
    await expect(addOptionButton).toBeVisible({ timeout: 6000 });
    await addOptionButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Successfully clicked Add Option button');

    // Step 19: Validate that the 3rd matching pair was successfully added and fill with meaningful content
    console.log('🔍 Validating that 3rd matching pair was successfully added...');
    
    const thirdMatchItem = page.getByPlaceholder('Match Item').nth(2);
    await expect(thirdMatchItem).toBeVisible({ timeout: 6000 });
    console.log('✅ Third match item is visible - Add Option functionality works!');

    console.log('🔍 Adding third match item...');
    
    await thirdMatchItem.click();
    await page.waitForTimeout(2000);
    await thirdMatchItem.fill('Java');
    await page.waitForTimeout(2000);
    console.log('✅ Third match item entered successfully: "Java"');

    // Step 20: Fill the third matching definition
    console.log('🔍 Adding third matching definition...');
    
    const thirdMatchDefinition = page.getByPlaceholder('Matching definition').nth(2);
    await expect(thirdMatchDefinition).toBeVisible({ timeout: 5000 });
    await thirdMatchDefinition.click();
    await page.waitForTimeout(2000);
    await thirdMatchDefinition.fill('Enterprise Applications and Backend');
    await page.waitForTimeout(2000);
    console.log('✅ Third matching definition entered successfully: "Enterprise Applications and Backend"');

    // Take screenshot with all three matching pairs filled
    await page.screenshot({ path: 'matching-all-pairs-filled.png', fullPage: true });
    console.log('📸 Screenshot saved: matching-all-pairs-filled.png');

    // Step 21: Update Score for Matching question
    console.log('🔍 Updating Score value for Matching question...');
    
    const matchingScoreInput = page.locator('input[type="text"][placeholder="0.00"]').first();
    await expect(matchingScoreInput).toBeVisible({ timeout: 6000 });
    await matchingScoreInput.click();
    await page.waitForTimeout(1000);
    
    // Clear current value and enter new score
    await matchingScoreInput.fill('10');
    await page.waitForTimeout(2000);
    console.log('✅ Matching question score updated to 10');

    // Take final screenshot with Matching question complete
    await page.screenshot({ path: 'matching-question-complete.png', fullPage: true });
    console.log('📸 Screenshot saved: matching-question-complete.png');

    console.log('🎉 Matching Interactive question creation workflow completed successfully!');

  });
});
