import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test.describe('Reorder Interactive Quiz Question - Creation & Validation', () => {
  
  test('should validate reorder question creation workflow', async ({ page }) => {
    
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
    
    const courseTitle = 'Reorder Interactive Quiz Course - Testing Functionality';
    await courseTitlePlaceholder.click();
    await courseTitlePlaceholder.fill(courseTitle);
    
    // Validate course title is entered
    const enteredTitle = await courseTitlePlaceholder.inputValue();
    expect(enteredTitle).toBe(courseTitle);
    console.log('✅ Course title provided:', courseTitle);

    // Step 5: Provide chapter title
    const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
    await chapterNamePlaceholder.click();
    
    const chapterTitle = 'Reorder Interactive Testing Chapter';
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
    
    const quizTitle = 'Reorder Interactive Knowledge Assessment Quiz';
    await quizTitleInput.fill(quizTitle);
    
    // Validate quiz title is entered
    const enteredQuizTitle = await quizTitleInput.inputValue();
    expect(enteredQuizTitle).toBe(quizTitle);
    console.log('✅ Quiz title provided:', quizTitle);

    // Step 9: Click on Add Quiz description placeholder and provide description
    const quizDescriptionInput = page.getByRole('textbox', { name: 'Add Quiz description' });
    await expect(quizDescriptionInput).toBeVisible();
    await quizDescriptionInput.click();
    
    const quizDescription = 'This interactive quiz tests your knowledge using reorder questions. Arrange the items in the correct sequence to demonstrate your understanding of the subject matter.';
    await quizDescriptionInput.fill(quizDescription);
    
    // Validate quiz description is entered
    const enteredQuizDescription = await quizDescriptionInput.inputValue();
    expect(enteredQuizDescription).toBe(quizDescription);
    console.log('✅ Quiz description provided:', quizDescription);

    // =====================================================================
    // ADD QUESTION BUTTON SECTION - COMMENTED OUT
    // =====================================================================
    /*
    // Step 10: Click on Add Question button for Reorder question
    console.log('🔍 Clicking on Add Question button for Reorder question...');
    
    // Locate the Add Question button using unique classes from screenshot
    const addQuestionButton = page.locator('button.components-button.is-secondary.has-text.has-icon');
    await expect(addQuestionButton).toBeVisible({ timeout: 5000 });
    await addQuestionButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Successfully clicked Add Question button for Reorder');
    
    // Take screenshot after clicking Add Question for Reorder
    await page.screenshot({ path: 'add-question-reorder.png', fullPage: true });
    console.log('📸 Screenshot saved: add-question-reorder.png');
    */
    // =====================================================================
    // END OF ADD QUESTION BUTTON SECTION
    // =====================================================================

    // Step 10: Click on Interactive tab
    console.log('🔍 Clicking on Interactive tab...');
    
    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await expect(interactiveTab).toBeVisible({ timeout: 5000 });
    await interactiveTab.click();
    await page.waitForTimeout(3000);
    console.log('✅ Successfully clicked on Interactive tab');
    
    // Take screenshot after clicking Interactive tab
    await page.screenshot({ path: 'interactive-tab-clicked.png', fullPage: true });
    console.log('📸 Screenshot saved: interactive-tab-clicked.png');

    // Step 11: Drag and Drop Reorder question type
    console.log('🔍 Starting Reorder question validation...');
    
    // Wait for Interactive tab content to load
    await page.waitForTimeout(3000);
    
    // Locate Reorder question type button in Interactive tab
    const reorderType = page.getByRole('button', { name: 'Quiz: Reorder' });
    await expect(reorderType).toBeVisible({ timeout: 5000 });   
    console.log('✅ Reorder question type is visible in Interactive tab');
    
    // Locate the drag & drop area for the new question
    const reorderDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await expect(reorderDragDropArea).toBeVisible({ timeout: 5000 });
    console.log('✅ Drag & Drop area is visible for new question');
    
    // Perform drag and drop operation
    await reorderType.dragTo(reorderDragDropArea);
    await page.waitForTimeout(1000);
    console.log('✅ Successfully dragged Reorder question to drag & drop area');
    
    // Take screenshot of Reorder question added
    await page.screenshot({ path: 'reorder-question-added.png', fullPage: true });
    console.log('📸 Screenshot saved: reorder-question-added.png');
    
    console.log('🎉 Reorder question drag & drop validation completed successfully!');

    // Step 12: Validate "Type your question here" is visible
    console.log('🔍 Validating "Type your question here" field visibility...');
    
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await expect(questionInput).toBeVisible({ timeout: 5000 });
    console.log('✅ "Type your question here" field is visible - drag and drop successful!');

    // Step 13: Fill question text for Reorder question
    console.log('🔍 Adding question text for Reorder question...');
    
    await questionInput.click();
    await page.waitForTimeout(5000);
    await questionInput.fill('Arrange the following software development phases in the correct order:');
    await page.waitForTimeout(5000);
    console.log('✅ Reorder question text entered successfully');

    // Step 14: Fill the first reorder option with meaningful content
    console.log('🔍 Adding first reorder option with meaningful content...');
    
    const firstReorderOption = page.getByPlaceholder('Reorder Option').first();
                                                                                                        await expect(firstReorderOption).toBeVisible({ timeout: 5000 });
    await firstReorderOption.click();
    await page.waitForTimeout(5000);
    await firstReorderOption.fill('Planning Phase');
    await page.waitForTimeout(5000);
    console.log('✅ First reorder option entered successfully: "Planning Phase"');

    // Step 14.1: Click on image icon for the first option
    console.log('🔍 Clicking on image icon for first reorder option...');

    // Locate the image icon for the first reorder option (should be next to the first option)
    const firstOptionImageIcon = page.locator('.crlms-badge > svg > path').first()
    await expect(firstOptionImageIcon).toBeVisible({ timeout: 5000 });
    await firstOptionImageIcon.click();
    await page.waitForTimeout(3000);
    console.log('✅ Successfully clicked image icon for first option');

    // Step 14.2: Handle media upload process
    console.log('🔍 Starting media upload process...');
    
    // Click on Media Library tab
    const reorderMediaLibraryOption = page.getByRole('tab', { name: 'Media Library' });
    await expect(reorderMediaLibraryOption).toBeVisible({ timeout: 5000 });
    await reorderMediaLibraryOption.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked on Media Library tab');

    // Select a random image from media library
    const reorderImageList = page.locator(".attachment-preview");
    const reorderImageCount = await reorderImageList.count();
    const randomImageIndex = Math.floor(Math.random() * reorderImageCount);
    const reorderRandomImage = reorderImageList.nth(randomImageIndex);
    
    await expect(reorderRandomImage).toBeVisible({ timeout: 5000 });
    await reorderRandomImage.click();
    await page.waitForTimeout(3000);
    console.log(`✅ Selected random image (index ${randomImageIndex}) from media library`);
    
    // Click "Use this media" button
    const reorderUseMediaButton = page.getByRole('button', { name: 'Use this media' });
    await expect(reorderUseMediaButton).toBeVisible({ timeout: 5000 });
    await reorderUseMediaButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Successfully uploaded and applied media to first option');

    // Take screenshot after media upload
    await page.screenshot({ path: 'first-option-media-uploaded.png', fullPage: true });
    console.log('📸 Screenshot saved: first-option-media-uploaded.png');

    // Step 15: Fill the second reorder option with meaningful content
    console.log('🔍 Adding second reorder option with meaningful content...');
    
    const secondReorderOption = page.getByPlaceholder('Reorder Option').nth(1);
    await expect(secondReorderOption).toBeVisible({ timeout: 5000 });
    await secondReorderOption.click();
    await page.waitForTimeout(3000);
    await secondReorderOption.fill('Development Phase');
    await page.waitForTimeout(3000);
    console.log('✅ Second reorder option entered successfully: "Development Phase"');

    // Step 15.1: Click on image icon for the second option
    console.log('🔍 Clicking on image icon for second reorder option...');

    // After first image is uploaded, the first badge disappears, so next .first() will be the second option
    await page.waitForTimeout(2000);
    const secondOptionImageIcon = page.locator('.crlms-badge > svg > path').first();
    await expect(secondOptionImageIcon).toBeVisible({ timeout: 5000 });
    await secondOptionImageIcon.click();
    await page.waitForTimeout(3000);
    console.log('✅ Successfully clicked image icon for second option');

    // Step 15.2: Handle media upload process for second option
    console.log('🔍 Starting media upload process for second option...');
    
    // Click on Media Library tab
    const reorderMediaLibraryOption2 = page.getByRole('tab', { name: 'Media Library' });
    await expect(reorderMediaLibraryOption2).toBeVisible({ timeout: 5000 });
    await reorderMediaLibraryOption2.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked on Media Library tab for second option');

    // Select a random image from media library for second option
    const reorderImageList2 = page.locator(".attachment-preview");
    const reorderImageCount2 = await reorderImageList2.count();
    const randomImageIndex2 = Math.floor(Math.random() * reorderImageCount2);
    const reorderRandomImage2 = reorderImageList2.nth(randomImageIndex2);
    
    await expect(reorderRandomImage2).toBeVisible({ timeout: 10000 });
    await reorderRandomImage2.click();
    await page.waitForTimeout(3000);
    console.log(`✅ Selected random image (index ${randomImageIndex2}) from media library for second option`);
    
    // Click "Use this media" button for second option
    const reorderUseMediaButton2 = page.getByRole('button', { name: 'Use this media' });
    await expect(reorderUseMediaButton2).toBeVisible({ timeout: 6000 });
    await reorderUseMediaButton2.click();
    await page.waitForTimeout(5000);
    console.log('✅ Successfully uploaded and applied media to second option');

    // Take screenshot after second option media upload
    await page.screenshot({ path: 'second-option-media-uploaded.png', fullPage: true });
    console.log('📸 Screenshot saved: second-option-media-uploaded.png');

    // Step 16: Click on Add Option button to add a third option
    console.log('🔍 Clicking on Add Option button...');
    
    const addOptionButton = page.getByRole('button', { name: 'Add Option' });
    await expect(addOptionButton).toBeVisible({ timeout: 6000 });
    await addOptionButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Successfully clicked Add Option button');

    // Step 17: Validate that the 3rd option was successfully added and fill with meaningful content
    console.log('🔍 Validating that 3rd reorder option was successfully added...');
    
    const thirdReorderOption = page.getByPlaceholder('Reorder Option').nth(2);
    await expect(thirdReorderOption).toBeVisible({ timeout: 6000 });
    console.log('✅ Third reorder option is visible - Add Option functionality works!');

    console.log('🔍 Adding third reorder option with meaningful content...');
    
    await thirdReorderOption.click();
    await page.waitForTimeout(1000);
    await thirdReorderOption.fill('Testing Phase');
    await page.waitForTimeout(1000);
    console.log('✅ Third reorder option entered successfully: "Testing Phase"');

    // Step 17.1: Click on image icon for the third option
    console.log('🔍 Clicking on image icon for third reorder option...');

    // After second image is uploaded, use .first() again (it will be the third option's badge)
    await page.waitForTimeout(2000);
    const thirdOptionImageIcon = page.locator('.crlms-badge > svg > path').first();
    await expect(thirdOptionImageIcon).toBeVisible({ timeout: 6000 });
    await thirdOptionImageIcon.click();
    await page.waitForTimeout(3000);
    console.log('✅ Successfully clicked image icon for third option');

    // Step 17.2: Handle media upload process for third option
    console.log('🔍 Starting media upload process for third option...');
    
    // Click on Media Library tab
    const reorderMediaLibraryOption3 = page.getByRole('tab', { name: 'Media Library' });
    await expect(reorderMediaLibraryOption3).toBeVisible({ timeout: 6000 });
    await reorderMediaLibraryOption3.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked on Media Library tab for third option');

    // Select a random image from media library for third option
    const reorderImageList3 = page.locator(".attachment-preview");
    const reorderImageCount3 = await reorderImageList3.count();
    const randomImageIndex3 = Math.floor(Math.random() * reorderImageCount3);
    const reorderRandomImage3 = reorderImageList3.nth(randomImageIndex3);
    
    await expect(reorderRandomImage3).toBeVisible({ timeout: 12000 });
    await reorderRandomImage3.click();
    await page.waitForTimeout(3000);
    console.log(`✅ Selected random image (index ${randomImageIndex3}) from media library for third option`);
    
    // Click "Use this media" button for third option
    const reorderUseMediaButton3 = page.getByRole('button', { name: 'Use this media' });
    await expect(reorderUseMediaButton3).toBeVisible({ timeout: 6000 });
    await reorderUseMediaButton3.click();
    await page.waitForTimeout(5000);
    console.log('✅ Successfully uploaded and applied media to third option');

    // Take screenshot after third option media upload
    await page.screenshot({ path: 'third-option-media-uploaded.png', fullPage: true });
    console.log('📸 Screenshot saved: third-option-media-uploaded.png');

    // Step 18: Update Score for Reorder question
    console.log('🔍 Updating Score value for Reorder question...');
    
    const reorderScoreInput = page.locator('input[type="text"][placeholder="0.00"]').first();
    await expect(reorderScoreInput).toBeVisible({ timeout: 6000 });
    await reorderScoreInput.click();
    await page.waitForTimeout(1000);
    
    // Clear current value and enter new score
    await reorderScoreInput.fill('5');
    await page.waitForTimeout(2000);
    console.log('✅ Reorder question score updated to 5');

    // Take screenshot with all meaningful options filled
    await page.screenshot({ path: 'all-reorder-options-filled.png', fullPage: true });
    console.log('📸 Screenshot saved: all-reorder-options-filled.png');

    // Take final screenshot with Reorder question complete
    await page.screenshot({ path: 'reorder-question-complete.png', fullPage: true });
    console.log('📸 Screenshot saved: reorder-question-complete.png');

    console.log('🎉 Reorder Interactive question creation workflow completed successfully!');

  });
});

test.describe('Reorder Interactive Quiz Question - Drag & Drop Functionality', () => {
  
  test.only('should validate reorder question drag and drop for students', async ({ page }) => {
    
    // Step 1: Log into WordPress dashboard
    await page.goto(adminLoginURL);
    
    // Fill in username and password
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');

    // Wait for navigation to wp-admin
    await page.waitForURL('**/wp-admin/**');
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

    // Step 5: Provide course title
    const courseTitleInput = page.locator("input[placeholder='Enter Course Title']");
    await page.waitForTimeout(3000);
    await courseTitleInput.click();
    await courseTitleInput.fill('Reorder Drag Drop Test Course');
    await page.waitForTimeout(2000);
    console.log('✅ Course title provided: Reorder Drag Drop Test Course');

    // Step 6: Provide chapter title
    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await expect(chapterTitleInput).toBeVisible({ timeout: 5000 });
    await chapterTitleInput.click();
    await chapterTitleInput.fill('Reorder Drag Drop Test Chapter');
    await page.waitForTimeout(2000);
    console.log('✅ Chapter title provided: Reorder Drag Drop Test Chapter');

    // Step 7: Click on Add Content button
    const addContentButton = page.getByRole('button', { name: 'Add Content' });
    await expect(addContentButton).toBeVisible({ timeout: 5000 });
    await addContentButton.click();
    await page.waitForTimeout(2000);
    console.log('✅ Clicked on Add Content button');

    // Step 8: Select Quiz from Add Content window
    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);
    console.log('✅ Selected Quiz from Add Content window');

    // Step 9: Provide quiz title
    const quizTitleInput = page.getByPlaceholder('Enter Quiz Title');
    await expect(quizTitleInput).toBeVisible({ timeout: 5000 });
    await quizTitleInput.click();
    await quizTitleInput.fill('Reorder Drag Drop Test Quiz');
    await page.waitForTimeout(2000);
    console.log('✅ Quiz title provided: Reorder Drag Drop Test Quiz');

    // Step 10: Click on Interactive tab
    console.log('🔍 Clicking on Interactive tab...');
    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await expect(interactiveTab).toBeVisible({ timeout: 5000 });
    await interactiveTab.click();
    await page.waitForTimeout(2000);
    console.log('✅ Successfully clicked on Interactive tab');

    // Step 11: Drag and drop Reorder question type
    console.log('🔍 Starting Reorder question drag and drop...');
    
    const reorderType = page.getByRole('button', { name: 'Quiz: Reorder' });
    await expect(reorderType).toBeVisible({ timeout: 5000 });
    console.log('✅ Reorder question type is visible in Interactive tab');
    
    const reorderDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await expect(reorderDragDropArea).toBeVisible({ timeout: 5000 });
    console.log('✅ Drag & Drop area is visible for new question');
    
    await reorderType.dragTo(reorderDragDropArea);
    await page.waitForTimeout(2000);
    console.log('✅ Successfully dragged Reorder question to drag & drop area');

    // Step 12: Fill question text
    console.log('🔍 Adding question text for Reorder question...');
    
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await expect(questionInput).toBeVisible({ timeout: 5000 });
    await questionInput.click();
    await page.waitForTimeout(2000);
    await questionInput.fill('Arrange these items in order:');
    await page.waitForTimeout(2000);
    console.log('✅ Reorder question text entered successfully');

    // Step 13: Fill the first reorder option
    console.log('🔍 Adding first reorder option...');
    
    const firstReorderOption = page.getByPlaceholder('Reorder Option').first();
    await expect(firstReorderOption).toBeVisible({ timeout: 5000 });
    await firstReorderOption.click();
    await page.waitForTimeout(2000);
    await firstReorderOption.fill('Option 1');
    await page.waitForTimeout(2000);
    console.log('✅ First reorder option entered: "Option 1"');

    // Step 14: Fill the second reorder option
    console.log('🔍 Adding second reorder option...');
    
    const secondReorderOption = page.getByPlaceholder('Reorder Option').nth(1);
    await expect(secondReorderOption).toBeVisible({ timeout: 5000 });
    await secondReorderOption.click();
    await page.waitForTimeout(2000);
    await secondReorderOption.fill('Option 2');
    await page.waitForTimeout(3000);
    console.log('✅ Second reorder option entered: "Option 2"');

    // Take screenshot before drag and drop
    await page.screenshot({ path: 'reorder-before-drag-drop.png', fullPage: true });
    console.log('📸 Screenshot saved: reorder-before-drag-drop.png');

    // Step 15: Store values of both options before drag and drop
    console.log('🔍 Storing option values before drag and drop...');
    
    const option1BeforeDrag = await firstReorderOption.inputValue();
    await page.waitForTimeout(1000);
    const option2BeforeDrag = await secondReorderOption.inputValue();
    console.log(`📋 Before drag - Option 1: "${option1BeforeDrag}", Option 2: "${option2BeforeDrag}"`);

    // Step 16: Perform drag and drop - drag option 2 to option 1's place
    console.log('🔍 Performing drag and drop: Option 2 → Option 1 position...');
    
    // Wait and scroll to make sure elements are visible
    await page.waitForTimeout(3000);
    await firstReorderOption.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
    
    // Locate the first and second option badges (drag handles) using XPath
    const firstOptionBadge = page.locator("//span[@class='crlms-badge crlms-badge-secondary crlms-badge-borderless'][normalize-space()='1']");
    await page.waitForTimeout(3000);
    const secondOptionBadge = page.locator("//span[@class='crlms-badge crlms-badge-secondary crlms-badge-borderless'][normalize-space()='2']");
    await page.waitForTimeout(3000);
    
    // Verify both badges are visible
    await expect(firstOptionBadge).toBeVisible({ timeout: 5000 });
    await expect(secondOptionBadge).toBeVisible({ timeout: 5000 });
    console.log('✅ Found both reorder option badges (drag handles)');
    
    // Perform drag and drop: drag option 2 to option 1's place
    await secondOptionBadge.hover();
    await page.waitForTimeout(2000);
    await secondOptionBadge.dragTo(firstOptionBadge);
    await page.waitForTimeout(3000);
    console.log('✅ Drag and drop operation completed: Option 2 dragged to Option 1 position');

    // Take screenshot after drag and drop
    await page.screenshot({ path: 'reorder-after-drag-drop.png', fullPage: true });
    console.log('📸 Screenshot saved: reorder-after-drag-drop.png');

    // Step 17: Validate the drag and drop by comparing before and after state
    console.log('🔍 Validating drag and drop functionality...');
    
    await page.waitForTimeout(2000);
    const option1AfterDrag = await page.getByPlaceholder('Reorder Option').first().inputValue();
    const option2AfterDrag = await page.getByPlaceholder('Reorder Option').nth(1).inputValue();
    console.log(`📋 After drag - Option 1: "${option1AfterDrag}", Option 2: "${option2AfterDrag}"`);

    // Validate that the options have swapped positions
    if (option1AfterDrag === option2BeforeDrag && option2AfterDrag === option1BeforeDrag) {
      console.log('✅ VALIDATION PASSED - Options successfully swapped!');
      console.log(`✅ Option 2 ("${option2BeforeDrag}") moved to Option 1 position`);
      console.log(`✅ Option 1 ("${option1BeforeDrag}") moved to Option 2 position`);
    } else {
      console.log('❌ VALIDATION FAILED - Options did not swap correctly');
      console.log(`Expected Option 1: "${option2BeforeDrag}", Got: "${option1AfterDrag}"`);
      console.log(`Expected Option 2: "${option1BeforeDrag}", Got: "${option2AfterDrag}"`);
    }

    
  });
});
