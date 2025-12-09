import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test.describe('Quiz Content Validation Tests', () => {
  
  test('should validate quiz type content creation workflow', async ({ page }) => {
    
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
    
    const courseTitle = 'Quiz Validation Course - Testing Quiz Functionality';
    await courseTitlePlaceholder.click();
    await courseTitlePlaceholder.fill(courseTitle);
    
    // Validate course title is entered
    const enteredTitle = await courseTitlePlaceholder.inputValue();
    expect(enteredTitle).toBe(courseTitle);
    console.log('✅ Course title provided:', courseTitle);

    // Step 5: Provide chapter title
    const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
    await chapterNamePlaceholder.click();
    
    const chapterTitle = 'Quiz Testing Chapter';
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
    
    const quizTitle = 'Software Testing Knowledge Assessment Quiz';
    await quizTitleInput.fill(quizTitle);
    
    // Validate quiz title is entered
    const enteredQuizTitle = await quizTitleInput.inputValue();
    expect(enteredQuizTitle).toBe(quizTitle);
    console.log('✅ Quiz title provided:', quizTitle);

    // Step 9: Click on Add Quiz description placeholder and provide description
    const quizDescriptionInput = page.getByRole('textbox', { name: 'Add Quiz description' });
    await expect(quizDescriptionInput).toBeVisible();
    await quizDescriptionInput.click();
    
    const quizDescription = 'This comprehensive quiz evaluates your understanding of fundamental software testing concepts, methodologies, and best practices. Test your knowledge on various testing types, SDLC integration, test case design techniques, and quality assurance principles.';
    await quizDescriptionInput.fill(quizDescription);
    
    // Validate quiz description is entered
    const enteredQuizDescription = await quizDescriptionInput.inputValue();
    expect(enteredQuizDescription).toBe(quizDescription);
    console.log('✅ Quiz description provided:', quizDescription);

    // Step 10: Validate Multiple Choice question type and drag-drop functionality
    console.log('🔍 Starting Multiple Choice question validation...');
    
    // Validate that Multiple Choice question type is visible in the right sidebar
    await page.waitForTimeout(2000);
    const multipleChoiceButton = page.locator("//div[@aria-label='Quiz: Multiple Choice']//div[@class='crlms-quiz-block-icon']");
    await expect(multipleChoiceButton).toBeVisible();
    console.log('✅ Multiple Choice question type is visible in sidebar');
    
    // Identify the drag & drop area (the target zone)
    await page.waitForTimeout(3000);
    const dragDropArea = page.getByText('Drag & DropDrag and drop a');
    await expect(dragDropArea).toBeVisible();
    console.log('✅ Drag & Drop area is visible and ready');
    await page.waitForTimeout(3000);
    
    // Perform drag and drop operation from Multiple Choice to drag & drop area
    await multipleChoiceButton.dragTo(dragDropArea);
    await page.waitForTimeout(3000);
    console.log('✅ Successfully dragged Multiple Choice question to drag & drop area');
    
    // Validate that Multiple Choice question was successfully dropped
    // Check if a question container or form appears after the drop
    const questionContainer = page.locator("//div[contains(@class, 'question-container') or contains(@class, 'question-item') or .//span[contains(text(), 'Multiple Choice')]]").first();
    await expect(questionContainer).toBeVisible({ timeout: 5000 });
    console.log('✅ Multiple Choice question container appeared after drag & drop');
    
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'multiple-choice-question-added.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: multiple-choice-question-added.png');
    
    console.log('🎉 Multiple Choice question drag & drop validation completed successfully!');

    // Click on 'Type your question here' input field and fill it with the specified text
    const questionInputField = page.getByRole('textbox', { name: 'Type your question here' });
    await page.waitForTimeout(3000);
    await questionInputField.click();
    await page.waitForTimeout(3000);
    await questionInputField.fill('Multiple Choice Question Sample Text!');
    await page.waitForTimeout(3000);
    console.log('✅ Question text entered successfully');

    // Step 11: Click on Option 1 placeholder input field and provide input
    console.log('🔍 Starting Option 1 input validation...');
    
    // Locate and click on Option 1 placeholder input field
    const option1Input = page.getByPlaceholder('Option 1');
    await expect(option1Input).toBeVisible();
    await option1Input.click();
    await page.waitForTimeout(2000);
    
    // Provide 'option 1' as input
    const option1Text = 'option 1';
    await option1Input.fill(option1Text);
    await page.waitForTimeout(2000);
    
    // Validate that the text was entered correctly
    const enteredOption1Text = await option1Input.inputValue();
    expect(enteredOption1Text).toBe(option1Text);
    console.log('✅ Option 1 text provided:', option1Text);
    
    // Step 12: Click on the selection box beside Option 1 input field
    console.log('🔍 Clicking on Option 1 selection box...');
    
    await page.waitForTimeout(3000);
    
    // Use a more specific locator combining components class with checkbox/radio functionality
    const selectionBox = page.locator('.components-flex.components-h-stack input[type="checkbox"]').first();
    await expect(selectionBox).toBeVisible({ timeout: 10000 });
    await selectionBox.click();
    await page.waitForTimeout(2000);
    console.log('✅ Successfully clicked on Option 1 selection box');

    // Step 13: Validate "This answer is correct" message appears
    console.log('🔍 Validating "This answer is correct" message...');
    const correctAnswerMessage = page.locator('text=This answer is correct');
    await expect(correctAnswerMessage).toBeVisible({ timeout: 5000 });
    console.log('✅ "This answer is correct" message is visible');
    
    // Take screenshot of the correct answer validation
    await page.screenshot({ path: 'option1-correct-answer-validation.png' });
    console.log('📸 Screenshot saved: option1-correct-answer-validation.png');

    // Step 14: Option 2 validation - Click on Option 2 placeholder input field and provide input
    console.log('🔍 Starting Option 2 input validation...');
    
    // Locate and click on Option 2 placeholder input field
    const option2Input = page.getByPlaceholder('Option 2');
    await expect(option2Input).toBeVisible();
    await option2Input.click();
    await page.waitForTimeout(2000);
    
    // Provide 'option 2' as input
    const option2Text = 'option 2';
    await option2Input.fill(option2Text);
    await page.waitForTimeout(2000);
    
    // Validate that the text was entered correctly
    const enteredOption2Text = await option2Input.inputValue();
    expect(enteredOption2Text).toBe(option2Text);
    console.log('✅ Option 2 text provided:', option2Text);
    
    // Step 15: Click on the selection box beside Option 2 input field
    console.log('🔍 Clicking on Option 2 selection box...');
    
    await page.waitForTimeout(3000);
    
    // Use locator for Option 2 selection box (second checkbox)
    const option2SelectionBox = page.locator('.components-flex.components-h-stack input[type="checkbox"]').nth(1);
    await expect(option2SelectionBox).toBeVisible({ timeout: 10000 });
    await option2SelectionBox.click();
    await page.waitForTimeout(2000);
    console.log('✅ Successfully clicked on Option 2 selection box');

    // Step 16: Validate "This answer is correct" message appears for Option 2
    console.log('🔍 Validating "This answer is correct" message for Option 2...');
    const option2CorrectMessage = page.locator('text=This answer is correct').nth(1);
    await expect(option2CorrectMessage).toBeVisible({ timeout: 5000 });
    console.log('✅ "This answer is correct" message is visible for Option 2');
    
    // Take screenshot of Option 2 correct answer validation
    await page.screenshot({ path: 'option2-correct-answer-validation.png' });
    console.log('📸 Screenshot saved: option2-correct-answer-validation.png');

    // Take screenshot to verify both options setup
    await page.screenshot({ path: 'options-setup-complete.png', fullPage: true });
    console.log('📸 Screenshot saved: options-setup-complete.png');
  await page.waitForTimeout(3000);  
  // Step 17: Click on the button to add Option 3
  console.log('🔍 Adding Option 3...');
  
  // Ensure page is still active before proceeding
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch (e) {
    console.log('⚠️ Network not idle, continuing...');
  }
  
  // Customized locator based on the DOM structure from screenshot
  let addOption3Button;
  try {
    // Use last() to get the add button after Option 2 (to add Option 3)
    addOption3Button = page.locator('button.components-button.crlms-add-option-btn.has-icon[type="button"]').last();
    await addOption3Button.waitFor({ state: 'visible', timeout: 10000 });
  } catch (error) {
    // Fallback: Try with simpler selector using last()
    addOption3Button = page.locator('.crlms-add-option-btn').last();
    await addOption3Button.waitFor({ state: 'visible', timeout: 5000 });
  }
  
  await page.waitForTimeout(2000);
  await addOption3Button.click();
  await page.waitForTimeout(3000);
  console.log('✅ Successfully clicked to add Option 3');

  // Step 18: Option 3 validation - Click on Option 3 placeholder input field and provide input
  console.log('🔍 Starting Option 3 input validation...');
  
  // Locate and click on Option 3 placeholder input field
  const option3Input = page.getByPlaceholder('Option 3');
  await expect(option3Input).toBeVisible();
  await option3Input.click();
  await page.waitForTimeout(2000);
  
  // Provide 'option 3' as input
  const option3Text = 'option 3';
  await option3Input.fill(option3Text);
  await page.waitForTimeout(2000);
  
  // Validate that the text was entered correctly
  const enteredOption3Text = await option3Input.inputValue();
  expect(enteredOption3Text).toBe(option3Text);
  console.log('✅ Option 3 text provided:', option3Text);

  // Take final screenshot with all three options
  await page.screenshot({ path: 'all-three-options-complete.png', fullPage: true });
  console.log('📸 Screenshot saved: all-three-options-complete.png');

  // Step 19: Click on Score input field and provide 5 as input
  console.log('🔍 Updating Score value...');
  
  // Locate the Score input field using unique classes from the screenshot
  const scoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]');
  await expect(scoreInput).toBeVisible({ timeout: 10000 });
  await scoreInput.click();
  await page.waitForTimeout(1000);
  
  // Clear current value and enter new score
  await scoreInput.selectText();
  await scoreInput.fill('5');
  await page.waitForTimeout(2000);
  
  // Validate that the score was entered correctly
  const enteredScore = await scoreInput.inputValue();
  expect(enteredScore).toBe('5');
  console.log('✅ Score updated to:', enteredScore);
  
  // Take screenshot of the updated score
  await page.screenshot({ path: 'score-updated-to-five.png', fullPage: true });
  console.log('📸 Screenshot saved: score-updated-to-five.png');

  // Step 20: Click on Add Question button
  console.log('🔍 Clicking on Add Question button...');
  
  // Locate the Add Question button using unique classes from screenshot
  const addQuestionButton = page.locator('button.components-button.is-secondary.has-text.has-icon');
  await expect(addQuestionButton).toBeVisible({ timeout: 5000 });
  await addQuestionButton.click();
  await page.waitForTimeout(3000);
  console.log('✅ Successfully clicked Add Question button');
  
  // Take screenshot after clicking Add Question
  await page.screenshot({ path: 'add-question-clicked.png', fullPage: true });
  console.log('📸 Screenshot saved: add-question-clicked.png');

  // Step 21: Drag and Drop Single Choice question type
  console.log('🔍 Starting Single Choice question validation...');
  
  // Wait for new question area to appear after clicking Add Question
  await page.waitForTimeout(3000);
  
  // Locate Single Choice question type in sidebar
  const singleChoiceType = page.locator('text=Single Choice').first();
  await expect(singleChoiceType).toBeVisible({ timeout: 5000 });
  console.log('✅ Single Choice question type is visible in sidebar');
  
  // Locate the drag & drop area for the new question
  const singleChoiceDragDropArea = page.getByText('Drag & DropDrag and drop a');
  await expect(singleChoiceDragDropArea).toBeVisible({ timeout: 5000 });
  console.log('✅ Drag & Drop area is visible for new question');
  
  // Perform drag and drop operation
  await singleChoiceType.dragTo(singleChoiceDragDropArea);
  await page.waitForTimeout(3000);
  console.log('✅ Successfully dragged Single Choice question to drag & drop area');
  
  // Verify Single Choice question container appeared
  const singleChoiceContainer = page.locator("//div[contains(@class, 'question-container') or contains(@class, 'question-item') or .//span[contains(text(), 'Single Choice')]]").nth(1);
  await expect(singleChoiceContainer).toBeVisible({ timeout: 5000 });
  console.log('✅ Single Choice question container appeared after drag & drop');
  
  // Take screenshot of Single Choice question added
  await page.screenshot({ path: 'single-choice-question-added.png', fullPage: true });
  console.log('📸 Screenshot saved: single-choice-question-added.png');
  
  console.log('🎉 Single Choice question drag & drop validation completed successfully!');

  // Step 22: Fill question text for Single Choice
  const singleChoiceQuestionInput = page.getByRole('textbox', { name: 'Type your question here' });
  await page.waitForTimeout(3000);
  await singleChoiceQuestionInput.click();
  await page.waitForTimeout(3000);
  await singleChoiceQuestionInput.fill('Single Choice Question Sample Text!');
  await page.waitForTimeout(3000);
  console.log('✅ Single Choice question text entered successfully');

  // Step 23: Add Option 1 for Single Choice and select it
  console.log('🔍 Starting Single Choice Option 1 input validation...');
  
  const scOption1Input = page.getByPlaceholder('Option 1');
  await expect(scOption1Input).toBeVisible();
  await scOption1Input.click();
  await page.waitForTimeout(2000);
  
  const scOption1Text = 'Single Choice Option 1';
  await scOption1Input.fill(scOption1Text);
  await page.waitForTimeout(2000);
  console.log('✅ Single Choice Option 1 text provided:', scOption1Text);
  
  // Click on Single Choice Option 1 selection box (radio button)
  console.log('🔍 Clicking on Single Choice Option 1 selection box...');
  const scOption1SelectionBox = page.locator('.components-flex.components-h-stack input[type="radio"]').first();
  await expect(scOption1SelectionBox).toBeVisible({ timeout: 10000 });
  await scOption1SelectionBox.click();
  await page.waitForTimeout(2000);
  console.log('✅ Successfully clicked on Single Choice Option 1 selection box');
  
  // Validate "This answer is correct" message for Single Choice Option 1
  console.log('🔍 Validating "This answer is correct" message for Single Choice Option 1...');
  const scOption1CorrectMessage = page.locator('text=This answer is correct');
  await expect(scOption1CorrectMessage).toBeVisible({ timeout: 5000 });
  console.log('✅ "This answer is correct" message is visible for Single Choice Option 1');

  // Step 24: Add Option 2 for Single Choice (without selection)
  console.log('🔍 Starting Single Choice Option 2 input validation...');
  
  const scOption2Input = page.getByPlaceholder('Option 2');
  await expect(scOption2Input).toBeVisible();
  await scOption2Input.click();
  await page.waitForTimeout(2000);
  
  const scOption2Text = 'Single Choice Option 2';
  await scOption2Input.fill(scOption2Text);
  await page.waitForTimeout(2000);
  console.log('✅ Single Choice Option 2 text provided:', scOption2Text);

  // Step 25: Add Option 3 for Single Choice
  console.log('🔍 Adding Single Choice Option 3...');
  
  // Wait for the Single Choice question options to be fully loaded
  await page.waitForTimeout(2000);
  
  // Try multiple approaches to find the add option button for Single Choice
  let scAddOption3Button;
  try {
    // First try: Find add option button in the Single Choice question area
    scAddOption3Button = page.locator('text=Single Choice').locator('..').locator('button.crlms-add-option-btn').last();
    await expect(scAddOption3Button).toBeVisible({ timeout: 5000 });
  } catch (error) {
    // Fallback: Use nth(1) since there should be 2 questions with add option buttons
    scAddOption3Button = page.locator('button.components-button.crlms-add-option-btn.has-icon').nth(1);
    await expect(scAddOption3Button).toBeVisible({ timeout: 5000 });
  }
  
  await scAddOption3Button.click();
  await page.waitForTimeout(3000);
  console.log('✅ Successfully clicked to add Single Choice Option 3');
  
  // Fill Option 3 for Single Choice
  console.log('🔍 Starting Single Choice Option 3 input validation...');
  
  const scOption3Input = page.getByPlaceholder('Option 3');
  await expect(scOption3Input).toBeVisible();
  await scOption3Input.click();
  await page.waitForTimeout(2000);
  
  const scOption3Text = 'Single Choice Option 3';
  await scOption3Input.fill(scOption3Text);
  await page.waitForTimeout(2000);
  console.log('✅ Single Choice Option 3 text provided:', scOption3Text);

  // Step 26: Update Score for Single Choice question
  console.log('🔍 Updating Score value for Single Choice question...');
  
  // Try different approaches to locate the Single Choice score input field
  let singleChoiceScoreInput;
  try {
    // First try: Look for the last score input field (should be for Single Choice)
    singleChoiceScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').last();
    await expect(singleChoiceScoreInput).toBeVisible({ timeout: 5000 });
  } catch (error) {
    try {
      // Second try: Look for any score input that's currently visible in the settings panel
      singleChoiceScoreInput = page.locator('input[placeholder="0.00"]:visible').last();
      await expect(singleChoiceScoreInput).toBeVisible({ timeout: 5000 });
    } catch (error2) {
      // Third try: Use a more general approach
      singleChoiceScoreInput = page.locator('input[type="text"][value="1"]').last();
      await expect(singleChoiceScoreInput).toBeVisible({ timeout: 5000 });
    }
  }
  
  await singleChoiceScoreInput.click();
  await page.waitForTimeout(1000);
  
  // Clear current value and enter new score
  await singleChoiceScoreInput.selectText();
  await singleChoiceScoreInput.fill('5');
  await page.waitForTimeout(2000);
  
  // Validate that the score was entered correctly
  const enteredSingleChoiceScore = await singleChoiceScoreInput.inputValue();
  expect(enteredSingleChoiceScore).toBe('5');
  console.log('✅ Single Choice Score updated to:', enteredSingleChoiceScore);
  
  // Take screenshot of the updated Single Choice score
  await page.screenshot({ path: 'single-choice-score-updated.png', fullPage: true });
  console.log('📸 Screenshot saved: single-choice-score-updated.png');

  // Take final screenshot with Single Choice question complete
  await page.screenshot({ path: 'single-choice-complete.png', fullPage: true });
  console.log('📸 Screenshot saved: single-choice-complete.png');

  // Step 27: Click on Add Question button again for third question
  console.log('🔍 Clicking on Add Question button again...');
  
  // Locate the Add Question button using unique classes from screenshot
  const addQuestionButton2 = page.locator('button.components-button.is-secondary.has-text.has-icon');
  await expect(addQuestionButton2).toBeVisible({ timeout: 5000 });
  await addQuestionButton2.click();
  await page.waitForTimeout(3000);
  console.log('✅ Successfully clicked Add Question button again');
  
  // Take screenshot after clicking Add Question again
  await page.screenshot({ path: 'add-question-clicked-again.png', fullPage: true });
  console.log('📸 Screenshot saved: add-question-clicked-again.png');

  // Step 28: Drag and Drop True/False question type
  console.log('🔍 Starting True/False question validation...');
  
  // Wait for new question area to appear after clicking Add Question
  await page.waitForTimeout(3000);
  
  // Locate True/False question type in sidebar using text content
  const trueFalseType = page.locator('text=True / False').first();
  await expect(trueFalseType).toBeVisible({ timeout: 5000 });
  console.log('✅ True/False question type is visible in sidebar');
  
  // Locate the drag & drop area for the new question
  const trueFalseDragDropArea = page.getByText('Drag & DropDrag and drop a');
  await expect(trueFalseDragDropArea).toBeVisible({ timeout: 5000 });
  console.log('✅ Drag & Drop area is visible for new question');
  
  // Perform drag and drop operation
  await trueFalseType.dragTo(trueFalseDragDropArea);
  await page.waitForTimeout(3000);
  console.log('✅ Successfully dragged True/False question to drag & drop area');
  
  // Verify True/False question container appeared
  const trueFalseContainer = page.locator("//div[contains(@class, 'question-container') or contains(@class, 'question-item') or .//span[contains(text(), 'True / False')]]").nth(2);
  await expect(trueFalseContainer).toBeVisible({ timeout: 5000 });
  console.log('✅ True/False question container appeared after drag & drop');
  
  // Take screenshot of True/False question added
  await page.screenshot({ path: 'true-false-question-added.png', fullPage: true });
  console.log('📸 Screenshot saved: true-false-question-added.png');
  
  console.log('🎉 True/False question drag & drop validation completed successfully!');

  // Step 29: Fill question text for True/False
  console.log('🔍 Filling True/False question text...');
  const trueFalseQuestionInput = page.getByRole('textbox', { name: 'Type your question here' });
  await page.waitForTimeout(3000);
  await trueFalseQuestionInput.click();
  await page.waitForTimeout(3000);
  await trueFalseQuestionInput.fill('Is software testing important for quality assurance?');
  await page.waitForTimeout(3000);
  console.log('✅ True/False question text entered successfully');

  // Step 30: Click on True option radio button
  console.log('🔍 Clicking on True option...');
  
  // Use specific locator for True radio button based on screenshot
  const trueOptionRadio = page.locator('input[type="radio"][value="True"]').first();
  await expect(trueOptionRadio).toBeVisible({ timeout: 10000 });
  await trueOptionRadio.click();
  await page.waitForTimeout(2000);
  console.log('✅ Successfully clicked on True option');
  
  // Validate "This answer is correct" message appears for True option
  console.log('🔍 Validating "This answer is correct" message for True option...');
  const trueCorrectMessage = page.locator('text=This answer is correct').last();
  await expect(trueCorrectMessage).toBeVisible({ timeout: 5000 });
  console.log('✅ "This answer is correct" message is visible for True option');
  
  // Take screenshot of True option selected with correct message
  await page.screenshot({ path: 'true-option-selected.png', fullPage: true });
  console.log('📸 Screenshot saved: true-option-selected.png');

  // Step 31: Update Score for True/False question
  console.log('🔍 Updating Score value for True/False question...');
  
  // Locate the Score input field for True/False question
  let trueFalseScoreInput;
  try {
    // Try to find score input field with more specific approach
    trueFalseScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').nth(2);
    await expect(trueFalseScoreInput).toBeVisible({ timeout: 5000 });
  } catch (error) {
    // Fallback to any available score input
    console.log('⚠️ Specific score input not found, trying fallback...');
    trueFalseScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').last();
    await expect(trueFalseScoreInput).toBeVisible({ timeout: 5000 });
  }
  
  await trueFalseScoreInput.click();
  await page.waitForTimeout(1000);
  
  // Clear current value and enter new score
  await trueFalseScoreInput.selectText();
  await trueFalseScoreInput.fill('5');
  await page.waitForTimeout(2000);
  
  // Validate that the score was entered correctly
  const enteredTrueFalseScore = await trueFalseScoreInput.inputValue();
  expect(enteredTrueFalseScore).toBe('5');
  console.log('✅ True/False Score updated to:', enteredTrueFalseScore);
  
  // Take screenshot of the updated True/False score
  await page.screenshot({ path: 'true-false-score-updated.png', fullPage: true });
  console.log('📸 Screenshot saved: true-false-score-updated.png');

  // Take final screenshot with True/False question complete
  await page.screenshot({ path: 'true-false-complete.png', fullPage: true });
  console.log('📸 Screenshot saved: true-false-complete.png');

  // Step 32: Click on Add Question button for fourth question
  console.log('🔍 Clicking on Add Question button for Short Text question...');
  
  // Locate the Add Question button using unique classes from screenshot
  const addQuestionButton3 = page.locator('button.components-button.is-secondary.has-text.has-icon');
  await expect(addQuestionButton3).toBeVisible({ timeout: 5000 });
  await addQuestionButton3.click();
  await page.waitForTimeout(3000);
  console.log('✅ Successfully clicked Add Question button for Short Text');
  
  // Take screenshot after clicking Add Question for Short Text
  await page.screenshot({ path: 'add-question-short-text.png', fullPage: true });
  console.log('📸 Screenshot saved: add-question-short-text.png');

  // Step 33: Drag and Drop Short Text question type
  console.log('🔍 Starting Short Text question validation...');
  
  // Wait for new question area to appear after clicking Add Question
  await page.waitForTimeout(3000);
  
  // Locate Short Text question type in sidebar using text content
  const shortTextType = page.locator('text=Short Text').first();
  await expect(shortTextType).toBeVisible({ timeout: 5000 });
  console.log('✅ Short Text question type is visible in sidebar');
  
  // Locate the drag & drop area for the new question
  const shortTextDragDropArea = page.getByText('Drag & DropDrag and drop a');
  await expect(shortTextDragDropArea).toBeVisible({ timeout: 5000 });
  console.log('✅ Drag & Drop area is visible for new question');
  
  // Perform drag and drop operation
  await shortTextType.dragTo(shortTextDragDropArea);
  await page.waitForTimeout(3000);
  console.log('✅ Successfully dragged Short Text question to drag & drop area');
  
  // Verify Short Text question container appeared
  const shortTextContainer = page.locator("//div[contains(@class, 'question-container') or contains(@class, 'question-item') or .//span[contains(text(), 'Short Text')]]").nth(3);
  await expect(shortTextContainer).toBeVisible({ timeout: 5000 });
  console.log('✅ Short Text question container appeared after drag & drop');
  
  // Take screenshot of Short Text question added
  await page.screenshot({ path: 'short-text-question-added.png', fullPage: true });
  console.log('📸 Screenshot saved: short-text-question-added.png');
  
  console.log('🎉 Short Text question drag & drop validation completed successfully!');

  // Step 33: Fill question text for Short Text question
  console.log('🔍 Adding question text for Short Text question...');
  
  const shortTextQuestionInput = page.getByRole('textbox', { name: 'Type your question here' });
  await expect(shortTextQuestionInput).toBeVisible({ timeout: 5000 });
  await shortTextQuestionInput.click();
  await page.waitForTimeout(2000);
  await shortTextQuestionInput.fill('Short Text Question: Please provide your answer in a few words.');
  await page.waitForTimeout(2000);
  console.log('✅ Short Text question text entered successfully');

  // Step 34: Update Score for Short Text question
  console.log('🔍 Updating Score value for Short Text question...');
  
  // Try different approaches to find the Short Text score input field
  let shortTextScoreInput;
  try {
    // First try: Find score input in Short Text question context
    shortTextScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').nth(3);
    await expect(shortTextScoreInput).toBeVisible({ timeout: 3000 });
  } catch (error) {
    try {
      // Fallback: Use last score input field
      shortTextScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').last();
      await expect(shortTextScoreInput).toBeVisible({ timeout: 5000 });
    } catch (error2) {
      // Final fallback: Any available score input
      shortTextScoreInput = page.locator('input[type="text"][placeholder="0.00"]').last();
      await expect(shortTextScoreInput).toBeVisible({ timeout: 5000 });
    }
  }
  
  await shortTextScoreInput.click();
  await page.waitForTimeout(1000);
  
  // Clear current value and enter new score
  await shortTextScoreInput.selectText();
  await shortTextScoreInput.fill('5');
  await page.waitForTimeout(2000);
  
  // Validate that the score was entered correctly
  const enteredShortTextScore = await shortTextScoreInput.inputValue();
  expect(enteredShortTextScore).toBe('5');
  console.log('✅ Short Text Score updated to:', enteredShortTextScore);
  
  // Take screenshot of the updated Short Text score
  await page.screenshot({ path: 'short-text-score-updated.png', fullPage: true });
  console.log('📸 Screenshot saved: short-text-score-updated.png');

  // Take final screenshot with Short Text question complete
  await page.screenshot({ path: 'short-text-complete.png', fullPage: true });
  console.log('📸 Screenshot saved: short-text-complete.png');

  // Step 35: Click on Add Question button for fifth question (Long Text)
  console.log('🔍 Clicking on Add Question button for Long Text question...');
  
  // Locate the Add Question button using unique classes from screenshot
  const addQuestionButton4 = page.locator('button.components-button.is-secondary.has-text.has-icon');
  await expect(addQuestionButton4).toBeVisible({ timeout: 5000 });
  await addQuestionButton4.click();
  await page.waitForTimeout(3000);
  console.log('✅ Successfully clicked Add Question button for Long Text');
  
  // Take screenshot after clicking Add Question for Long Text
  await page.screenshot({ path: 'add-question-long-text.png', fullPage: true });
  console.log('📸 Screenshot saved: add-question-long-text.png');

  // Step 36: Drag and Drop Long Text question type
  console.log('🔍 Starting Long Text question validation...');
  
  // Wait for new question area to appear after clicking Add Question
  await page.waitForTimeout(3000);
  
  // Locate Long Text question type in sidebar using text content
  const longTextType = page.locator('text=Long Text').first();
  await expect(longTextType).toBeVisible({ timeout: 5000 });
  console.log('✅ Long Text question type is visible in sidebar');
  
  // Locate the drag & drop area for the new question
  const longTextDragDropArea = page.getByText('Drag & DropDrag and drop a');
  await expect(longTextDragDropArea).toBeVisible({ timeout: 5000 });
  console.log('✅ Drag & Drop area is visible for new question');
  
  // Perform drag and drop operation
  await longTextType.dragTo(longTextDragDropArea);
  await page.waitForTimeout(3000);
  console.log('✅ Successfully dragged Long Text question to drag & drop area');
  
  // Verify Long Text question container appeared
  const longTextContainer = page.locator("//div[contains(@class, 'question-container') or contains(@class, 'question-item') or .//span[contains(text(), 'Long Text')]]").nth(4);
  await expect(longTextContainer).toBeVisible({ timeout: 5000 });
  console.log('✅ Long Text question container appeared after drag & drop');
  
  // Take screenshot of Long Text question added
  await page.screenshot({ path: 'long-text-question-added.png', fullPage: true });
  console.log('📸 Screenshot saved: long-text-question-added.png');
  
  console.log('🎉 Long Text question drag & drop validation completed successfully!');

  // Step 37: Fill question text for Long Text question
  console.log('🔍 Adding question text for Long Text question...');
  
  const longTextQuestionInput = page.getByRole('textbox', { name: 'Type your question here' });
  await expect(longTextQuestionInput).toBeVisible({ timeout: 5000 });
  await longTextQuestionInput.click();
  await page.waitForTimeout(2000);
  await longTextQuestionInput.fill('Long Text Question: Please provide a detailed explanation of your answer.');
  await page.waitForTimeout(2000);
  console.log('✅ Long Text question text entered successfully');

  // Step 38: Update Score for Long Text question (set to 10)
  console.log('🔍 Updating Score value for Long Text question...');
  
  // Try different approaches to find the Long Text score input field
  let longTextScoreInput;
  try {
    // First try: Find score input in Long Text question context
    longTextScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').nth(4);
    await expect(longTextScoreInput).toBeVisible({ timeout: 3000 });
  } catch (error) {
    try {
      // Fallback: Use last score input field
      longTextScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').last();
      await expect(longTextScoreInput).toBeVisible({ timeout: 5000 });
    } catch (error2) {
      // Final fallback: Any available score input
      longTextScoreInput = page.locator('input[type="text"][placeholder="0.00"]').last();
      await expect(longTextScoreInput).toBeVisible({ timeout: 5000 });
    }
  }
  
  await longTextScoreInput.click();
  await page.waitForTimeout(1000);
  
  // Clear current value and enter new score (10)
  await longTextScoreInput.selectText();
  await longTextScoreInput.fill('10');
  await page.waitForTimeout(2000);
  
  // Validate that the score was entered correctly
  const enteredLongTextScore = await longTextScoreInput.inputValue();
  expect(enteredLongTextScore).toBe('10');
  console.log('✅ Long Text Score updated to:', enteredLongTextScore);
  
  // Take screenshot of the updated Long Text score
  await page.screenshot({ path: 'long-text-score-updated.png', fullPage: true });
  console.log('📸 Screenshot saved: long-text-score-updated.png');

  // Take final screenshot with Long Text question complete
  await page.screenshot({ path: 'long-text-complete.png', fullPage: true });
  console.log('📸 Screenshot saved: long-text-complete.png');

  // Step 40: Click on Add Question button for Statement question
  console.log('🔍 Clicking on Add Question button for Statement question...');
  
  const addQuestionButton5 = page.locator('button.components-button.is-secondary.has-text.has-icon');
  await expect(addQuestionButton5).toBeVisible({ timeout: 5000 });
  await addQuestionButton5.click();
  await page.waitForTimeout(3000);
  console.log('✅ Successfully clicked Add Question button for Statement');
  
  // Take screenshot after clicking Add Question for Statement
  await page.screenshot({ path: 'add-question-statement.png', fullPage: true });
  console.log('📸 Screenshot saved: add-question-statement.png');

  // Step 41: Drag and Drop Statement question type
  console.log('🔍 Starting Statement question validation...');
  
  // Wait for new question area to appear after clicking Add Question
  await page.waitForTimeout(3000);
  
  // Locate Statement question type in sidebar
  const statementType = page.locator('text=Statement').first();
  await expect(statementType).toBeVisible({ timeout: 5000 });
  console.log('✅ Statement question type is visible in sidebar');
  
  // Locate the drag & drop area for the new question
  const statementDragDropArea = page.getByText('Drag & DropDrag and drop a');
  await expect(statementDragDropArea).toBeVisible({ timeout: 5000 });
  console.log('✅ Drag & Drop area is visible for new question');
  
  // Perform drag and drop operation
  await statementType.dragTo(statementDragDropArea);
  await page.waitForTimeout(3000);
  console.log('✅ Successfully dragged Statement question to drag & drop area');
  
  // Verify Statement question container appeared
  const statementContainer = page.locator("//div[contains(@class, 'question-container') or contains(@class, 'question-item') or .//span[contains(text(), 'Statement')]]").nth(5);
  await expect(statementContainer).toBeVisible({ timeout: 5000 });
  console.log('✅ Statement question container appeared after drag & drop');
  
  // Take screenshot of Statement question added
  await page.screenshot({ path: 'statement-question-added.png', fullPage: true });
  console.log('📸 Screenshot saved: statement-question-added.png');
  
  console.log('🎉 Statement question drag & drop validation completed successfully!');

  // Step 40: Fill question text for Statement question
  console.log('🔍 Adding question text for Statement question...');
  
  const statementQuestionInput = page.getByRole('textbox', { name: 'Type your question here' });
  await expect(statementQuestionInput).toBeVisible({ timeout: 5000 });
  await statementQuestionInput.click();
  await page.waitForTimeout(2000);
  await statementQuestionInput.fill('Statement Question: This is an informational statement for students to read.');
  await page.waitForTimeout(2000);
  console.log('✅ Statement question text entered successfully');

  // Step 41: Update Score for Statement question
  console.log('🔍 Updating Score value for Statement question...');
  
  // Try different approaches to find the Statement score input field
  let statementScoreInput;
  try {
    // First try: Find score input in Statement question context
    statementScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').nth(5);
    await expect(statementScoreInput).toBeVisible({ timeout: 3000 });
  } catch (error) {
    try {
      // Fallback: Use last score input field
      statementScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').last();
      await expect(statementScoreInput).toBeVisible({ timeout: 5000 });
    } catch (error2) {
      // Final fallback: Any available score input
      statementScoreInput = page.locator('input[type="text"][placeholder="0.00"]').last();
      await expect(statementScoreInput).toBeVisible({ timeout: 5000 });
    }
  }
  
  await statementScoreInput.click();
  await page.waitForTimeout(1000);
  
  // Clear current value and enter new score
  await statementScoreInput.selectText();
  await statementScoreInput.fill('5');
  await page.waitForTimeout(2000);
  
  // Validate that the score was entered correctly
  const enteredStatementScore = await statementScoreInput.inputValue();
  expect(enteredStatementScore).toBe('5');
  console.log('✅ Statement Score updated to:', enteredStatementScore);
  
  // Take screenshot of the updated Statement score
  await page.screenshot({ path: 'statement-score-updated.png', fullPage: true });
  console.log('📸 Screenshot saved: statement-score-updated.png');

  // Take final screenshot with Statement question complete
  await page.screenshot({ path: 'statement-complete.png', fullPage: true });
  console.log('📸 Screenshot saved: statement-complete.png');

  // Step 40: Click on Add Question button for Fill In The Blank question
  console.log('🔍 Clicking on Add Question button for Fill In The Blank question...');
  
  // Locate the Add Question button using unique classes from screenshot
  const addQuestionButton6 = page.locator('button.components-button.is-secondary.has-text.has-icon');
  await expect(addQuestionButton6).toBeVisible({ timeout: 5000 });
  await addQuestionButton6.click();
  await page.waitForTimeout(3000);
  console.log('✅ Successfully clicked Add Question button for Fill In The Blank');
  
  // Take screenshot after clicking Add Question for Fill In The Blank
  await page.screenshot({ path: 'add-question-fill-blank.png', fullPage: true });
  console.log('📸 Screenshot saved: add-question-fill-blank.png');

  // Step 41: Drag and Drop Fill In The Blank question type
  console.log('🔍 Starting Fill In The Blank question validation...');
  
  // Wait for new question area to appear after clicking Add Question
  await page.waitForTimeout(3000);
  
  // Scroll down in the sidebar to find Fill In The Blank question type
  console.log('🔍 Scrolling down in sidebar to find Fill In The Blank question type...');
  const sidebar = page.locator('.crlms-quiz-blocks-wrapper .crlms-quiz-blocks-wrapper-classic');
  await sidebar.evaluate(node => node.scrollBy(0, 300));
  await page.waitForTimeout(2000);
  console.log('✅ Scrolled down in sidebar');
  
  // Locate Fill In The Blank question type in sidebar using specific span locator from DOM
  const fillBlankType = page.getByRole('button', { name: 'Quiz: Fill In The Blank' });
  
  // Validate if Fill In The Blank is visible after scrolling
  const isVisible = await fillBlankType.isVisible();
  if (!isVisible) {
    console.log('⚠️ Fill In The Blank not visible, scrolling more...');
    await sidebar.evaluate(node => node.scrollBy(0, 200));
    await page.waitForTimeout(2000);
  }
  
  await expect(fillBlankType).toBeVisible({ timeout: 5000 });
  console.log('✅ Fill In The Blank question type is visible in sidebar after scrolling');
  
  // Locate the drag & drop area for the new question
  const fillBlankDragDropArea = page.getByText('Drag & DropDrag and drop a');
  await expect(fillBlankDragDropArea).toBeVisible({ timeout: 5000 });
  console.log('✅ Drag & Drop area is visible for new question');
  await page.waitForTimeout(3000);
  
  // Perform drag and drop operation
  await fillBlankType.dragTo(fillBlankDragDropArea);
  await page.waitForTimeout(3000);
  console.log('✅ Successfully dragged Fill In The Blank question to drag & drop area');
  
  // Verify Fill In The Blank question was added
  const fillBlankTitle = page.getByLabel('Scrollable section').getByText('Fill In The Blank');
  await expect(fillBlankTitle).toBeVisible({ timeout: 5000 });
  console.log('✅ Fill In The Blank question container appeared after drag & drop');
  
  // Take screenshot of Fill In The Blank question added
  await page.screenshot({ path: 'fill-in-blank-question-added.png', fullPage: true });
  console.log('📸 Screenshot saved: fill-in-blank-question-added.png');
  
  console.log('🎉 Fill In The Blank question drag & drop validation completed successfully!');

  // Step 42: Fill question text for Fill In The Blank question
  console.log('🔍 Adding question text for Fill In The Blank question...');
  
  const fillInBlankQuestionInput = page.getByRole('textbox', { name: 'Type your question here' });
  await expect(fillInBlankQuestionInput).toBeVisible({ timeout: 5000 });
  await fillInBlankQuestionInput.click();
  await page.waitForTimeout(2000);
  await fillInBlankQuestionInput.fill('__ In The Blank');
  await page.waitForTimeout(2000);
  console.log('✅ Fill In The Blank question text entered successfully');

  // Step 43: Fill answers for Fill In The Blank question
  console.log('🔍 Adding answers for Fill In The Blank question...');
  
  const fillInBlankAnswersInput = page.getByRole('textbox', { name: 'Enter answer(s) here,' });
  await expect(fillInBlankAnswersInput).toBeVisible({ timeout: 5000 });
  await fillInBlankAnswersInput.click();
  await page.waitForTimeout(2000);
  await fillInBlankAnswersInput.fill('Fill, Complete, Answer');
  await page.waitForTimeout(2000);
  console.log('✅ Fill In The Blank answers entered successfully');

  // Step 44: Update Score for Fill In The Blank question
  console.log('🔍 Updating Score value for Fill In The Blank question...');
  
  // Try different approaches to find the Fill In The Blank score input field
  let fillInBlankScoreInput;
  try {
    // First try: Find score input in Fill In The Blank question context
    fillInBlankScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').nth(6);
    await expect(fillInBlankScoreInput).toBeVisible({ timeout: 3000 });
  } catch (error) {
    try {
      // Fallback: Use last score input field
      fillInBlankScoreInput = page.locator('.components-text-control__input.is-next-40px-default-size[type="text"][placeholder="0.00"]').last();
      await expect(fillInBlankScoreInput).toBeVisible({ timeout: 5000 });
    } catch (error2) {
      // Final fallback: Any available score input
      fillInBlankScoreInput = page.locator('input[type="text"][placeholder="0.00"]').last();
      await expect(fillInBlankScoreInput).toBeVisible({ timeout: 5000 });
    }
  }
  
  await fillInBlankScoreInput.click();
  await page.waitForTimeout(1000);
  
  // Clear current value and enter new score
  await fillInBlankScoreInput.selectText();
  await fillInBlankScoreInput.fill('5');
  await page.waitForTimeout(2000);
  
  // Validate that the score was entered correctly
  const enteredFillInBlankScore = await fillInBlankScoreInput.inputValue();
  expect(enteredFillInBlankScore).toBe('5');
  console.log('✅ Fill In The Blank Score updated to:', enteredFillInBlankScore);
  
  // Take screenshot of the updated Fill In The Blank score
  await page.screenshot({ path: 'fill-in-blank-score-updated.png', fullPage: true });
  console.log('📸 Screenshot saved: fill-in-blank-score-updated.png');

  // Take final screenshot with Fill In The Blank question complete
  await page.screenshot({ path: 'fill-in-blank-complete.png', fullPage: true });
  console.log('📸 Screenshot saved: fill-in-blank-complete.png');

  });
});
