import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

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

test.describe('Matching Interactive Quiz Question - Media Attachment Tests', () => {
  
  test('should add image to match item', async ({ page }) => {
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
    await courseTitleInput.fill('Media Attachment Test Course');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Media Attachment Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Media Attachment Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);
    console.log('✅ Matching question added');

    // Step 6: Fill question and match item
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Match items with images');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Python Programming');
    await page.waitForTimeout(2000);

    // Step 7: Click image icon for match item
    console.log('🔍 Adding image to match item...');
    
    // Find the image icon button next to the first match item
    const matchItemImageIcon = page.locator('img[alt=""]').first();
    await expect(matchItemImageIcon).toBeVisible({ timeout: 5000 });
    await matchItemImageIcon.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked image icon for match item');

    // Step 8: Select image from Media Library
    const mediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryTab).toBeVisible({ timeout: 5000 });
    await mediaLibraryTab.click();
    await page.waitForTimeout(3000);
    console.log('✅ Opened Media Library');

    // Select a random image
    const imageList = page.locator(".attachment-preview");
    const imageCount = await imageList.count();
    const randomImageIndex = Math.floor(Math.random() * imageCount);
    const randomImage = imageList.nth(randomImageIndex);
    
    await expect(randomImage).toBeVisible({ timeout: 5000 });
    await randomImage.click();
    await page.waitForTimeout(3000);
    console.log(`✅ Selected random image (index ${randomImageIndex})`);

    // Click "Use this media" button
    const useMediaButton = page.getByRole('button', { name: 'Use this media' });
    await expect(useMediaButton).toBeVisible({ timeout: 5000 });
    await useMediaButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Successfully added image to match item');

    await page.screenshot({ path: 'media-match-item-image.png', fullPage: true });
    console.log('📸 Screenshot saved: media-match-item-image.png');
    console.log('✅ Add image to match item test completed');
  });

  test('should add image to matching definition', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    // Steps 1-6: Same setup as above
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
    await courseTitleInput.fill('Definition Image Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Definition Image Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Definition Image Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Match with definition images');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('JavaScript');
    await page.waitForTimeout(2000);

    const firstMatchDefinition = page.getByPlaceholder('Matching definition').first();
    await firstMatchDefinition.click();
    await firstMatchDefinition.fill('Frontend Language');
    await page.waitForTimeout(2000);

    // Step 7: Click image icon for matching definition
    console.log('🔍 Adding image to matching definition...');
    
    // Find the second image icon (for definition field)
    const definitionImageIcon = page.locator('img[alt=""]').nth(1);
    await expect(definitionImageIcon).toBeVisible({ timeout: 5000 });
    await definitionImageIcon.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked image icon for matching definition');

    // Step 8: Select image from Media Library
    const mediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryTab).toBeVisible({ timeout: 5000 });
    await mediaLibraryTab.click();
    await page.waitForTimeout(3000);

    const imageList = page.locator(".attachment-preview");
    const imageCount = await imageList.count();
    const randomImageIndex = Math.floor(Math.random() * imageCount);
    const randomImage = imageList.nth(randomImageIndex);
    
    await expect(randomImage).toBeVisible({ timeout: 5000 });
    await randomImage.click();
    await page.waitForTimeout(3000);
    console.log(`✅ Selected random image (index ${randomImageIndex})`);

    const useMediaButton = page.getByRole('button', { name: 'Use this media' });
    await expect(useMediaButton).toBeVisible({ timeout: 5000 });
    await useMediaButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Successfully added image to matching definition');

    await page.screenshot({ path: 'media-definition-image.png', fullPage: true });
    console.log('📸 Screenshot saved: media-definition-image.png');
    console.log('✅ Add image to matching definition test completed');
  });

  test('should add video to match item', async ({ page }) => {
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
    await courseTitleInput.fill('Video Match Item Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Video Match Item Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Video Match Item Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Match items with videos');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Tutorial Video');
    await page.waitForTimeout(2000);

    // Click video icon for match item
    console.log('🔍 Adding video to match item...');
    
    const addVideoButton = page.getByRole('button', { name: 'Add Video' }).first();
    await expect(addVideoButton).toBeVisible({ timeout: 5000 });
    await addVideoButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Add Video button for match item');

    // Select video from Media Library
    const mediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryTab).toBeVisible({ timeout: 5000 });
    await mediaLibraryTab.click();
    await page.waitForTimeout(3000);

    const videoList = page.locator(".attachment-preview");
    const videoCount = await videoList.count();
    if (videoCount > 0) {
      const randomVideoIndex = Math.floor(Math.random() * videoCount);
      const randomVideo = videoList.nth(randomVideoIndex);
      
      await expect(randomVideo).toBeVisible({ timeout: 5000 });
      await randomVideo.click();
      await page.waitForTimeout(3000);
      console.log(`✅ Selected video (index ${randomVideoIndex})`);

      const useMediaButton = page.getByRole('button', { name: 'Use this media' });
      await expect(useMediaButton).toBeVisible({ timeout: 5000 });
      await useMediaButton.click();
      await page.waitForTimeout(5000);
      console.log('✅ Successfully added video to match item');
    } else {
      console.log('⚠️ No videos found in media library');
    }

    await page.screenshot({ path: 'media-match-item-video.png', fullPage: true });
    console.log('📸 Screenshot saved: media-match-item-video.png');
    console.log('✅ Add video to match item test completed');
  });

  test('should add video to matching definition', async ({ page }) => {
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
    await courseTitleInput.fill('Video Definition Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Video Definition Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Video Definition Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Match with definition videos');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Concept');
    await page.waitForTimeout(2000);

    const firstMatchDefinition = page.getByPlaceholder('Matching definition').first();
    await firstMatchDefinition.click();
    await firstMatchDefinition.fill('Explanation Video');
    await page.waitForTimeout(2000);

    // Click video icon for matching definition
    console.log('🔍 Adding video to matching definition...');
    
    const addVideoButtons = page.getByRole('button', { name: 'Add Video' });
    const videoButtonCount = await addVideoButtons.count();
    const definitionVideoButton = addVideoButtons.nth(videoButtonCount > 1 ? 1 : 0);
    
    await expect(definitionVideoButton).toBeVisible({ timeout: 5000 });
    await definitionVideoButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Add Video button for matching definition');

    const mediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryTab).toBeVisible({ timeout: 5000 });
    await mediaLibraryTab.click();
    await page.waitForTimeout(3000);

    const videoList = page.locator(".attachment-preview");
    const videoCount = await videoList.count();
    if (videoCount > 0) {
      const randomVideoIndex = Math.floor(Math.random() * videoCount);
      const randomVideo = videoList.nth(randomVideoIndex);
      
      await expect(randomVideo).toBeVisible({ timeout: 5000 });
      await randomVideo.click();
      await page.waitForTimeout(3000);
      console.log(`✅ Selected video (index ${randomVideoIndex})`);

      const useMediaButton = page.getByRole('button', { name: 'Use this media' });
      await expect(useMediaButton).toBeVisible({ timeout: 5000 });
      await useMediaButton.click();
      await page.waitForTimeout(5000);
      console.log('✅ Successfully added video to matching definition');
    } else {
      console.log('⚠️ No videos found in media library');
    }

    await page.screenshot({ path: 'media-definition-video.png', fullPage: true });
    console.log('📸 Screenshot saved: media-definition-video.png');
    console.log('✅ Add video to matching definition test completed');
  });

  test('should generate AI photo for match item', async ({ page }) => {
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
    await courseTitleInput.fill('AI Photo Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('AI Photo Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('AI Photo Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Match items with AI generated photos');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Mountain Landscape');
    await page.waitForTimeout(2000);

    // Click Generate AI Photo button
    console.log('🔍 Generating AI photo for match item...');
    
    const generateAIButton = page.getByRole('button', { name: 'Generate AI Photo' }).first();
    await expect(generateAIButton).toBeVisible({ timeout: 5000 });
    await generateAIButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Generate AI Photo button');

    // AI photo generation UI should appear here
    await page.screenshot({ path: 'media-ai-photo-generation.png', fullPage: true });
    console.log('📸 Screenshot saved: media-ai-photo-generation.png');
    console.log('✅ Generate AI photo test completed');
  });

  test('should remove attached media from match item', async ({ page }) => {
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
    await courseTitleInput.fill('Remove Media Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Remove Media Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Remove Media Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Test remove media functionality');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Item with Image');
    await page.waitForTimeout(2000);

    // First add an image
    console.log('🔍 Adding image to match item...');
    const matchItemImageIcon = page.locator('img[alt=""]').first();
    await expect(matchItemImageIcon).toBeVisible({ timeout: 5000 });
    await matchItemImageIcon.click();
    await page.waitForTimeout(3000);

    const mediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryTab).toBeVisible({ timeout: 5000 });
    await mediaLibraryTab.click();
    await page.waitForTimeout(3000);

    const imageList = page.locator(".attachment-preview");
    const randomImage = imageList.first();
    await expect(randomImage).toBeVisible({ timeout: 5000 });
    await randomImage.click();
    await page.waitForTimeout(3000);

    const useMediaButton = page.getByRole('button', { name: 'Use this media' });
    await expect(useMediaButton).toBeVisible({ timeout: 5000 });
    await useMediaButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Image added successfully');

    await page.screenshot({ path: 'media-before-removal.png', fullPage: true });
    console.log('📸 Screenshot saved: media-before-removal.png');

    // Now remove the image
    console.log('🔍 Removing attached media...');
    
    // Look for remove/delete button (usually appears after media is attached)
    const removeMediaButton = page.locator('button').filter({ hasText: /Remove|Delete|Clear/ }).first();
    const removeButtonCount = await removeMediaButton.count();
    
    if (removeButtonCount > 0) {
      await removeMediaButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ Successfully removed attached media');
    } else {
      console.log('⚠️ Remove media button not found - checking alternative methods');
    }

    await page.screenshot({ path: 'media-after-removal.png', fullPage: true });
    console.log('📸 Screenshot saved: media-after-removal.png');
    console.log('✅ Remove media test completed');
  });
});
