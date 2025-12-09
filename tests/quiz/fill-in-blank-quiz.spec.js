import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test.describe('Fill In The Blank Quiz Question Tests', () => {
  
  test('should validate fill in the blank question creation workflow', async ({ page }) => {
    
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
    
    const courseTitle = 'Fill In The Blank Quiz Course - Testing Functionality';
    await courseTitlePlaceholder.click();
    await courseTitlePlaceholder.fill(courseTitle);
    
    // Validate course title is entered
    const enteredTitle = await courseTitlePlaceholder.inputValue();
    expect(enteredTitle).toBe(courseTitle);
    console.log('✅ Course title provided:', courseTitle);

    // Step 5: Provide chapter title
    const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
    await chapterNamePlaceholder.click();
    
    const chapterTitle = 'Fill In The Blank Testing Chapter';
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
    
    const quizTitle = 'Fill In The Blank Knowledge Assessment Quiz';
    await quizTitleInput.fill(quizTitle);
    
    // Validate quiz title is entered
    const enteredQuizTitle = await quizTitleInput.inputValue();
    expect(enteredQuizTitle).toBe(quizTitle);
    console.log('✅ Quiz title provided:', quizTitle);

    // Step 9: Click on Add Quiz description placeholder and provide description
    const quizDescriptionInput = page.getByRole('textbox', { name: 'Add Quiz description' });
    await expect(quizDescriptionInput).toBeVisible();
    await quizDescriptionInput.click();
    
    const quizDescription = 'This quiz tests your knowledge using fill in the blank questions. Complete the missing words or phrases to demonstrate your understanding of the subject matter.';
    await quizDescriptionInput.fill(quizDescription);
    
    // Validate quiz description is entered
    const enteredQuizDescription = await quizDescriptionInput.inputValue();
    expect(enteredQuizDescription).toBe(quizDescription);
    console.log('✅ Quiz description provided:', quizDescription);

    // =====================================================================
    // ADD QUESTION BUTTON SECTION - COMMENTED OUT
    // =====================================================================
    /*
    // Step 10: Click on Add Question button for Fill In The Blank question
    console.log('🔍 Clicking on Add Question button for Fill In The Blank question...');
    
    // Locate the Add Question button using unique classes from screenshot
    const addQuestionButton = page.locator('button.components-button.is-secondary.has-text.has-icon');
    await expect(addQuestionButton).toBeVisible({ timeout: 5000 });
    await addQuestionButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Successfully clicked Add Question button for Fill In The Blank');
    
    // Take screenshot after clicking Add Question for Fill In The Blank
    await page.screenshot({ path: 'add-question-fill-blank.png', fullPage: true });
    console.log('📸 Screenshot saved: add-question-fill-blank.png');
    */
    // =====================================================================
    // END OF ADD QUESTION BUTTON SECTION
    // =====================================================================

    // Step 11: Drag and Drop Fill In The Blank question type
    console.log('🔍 Starting Fill In The Blank question validation...');
    
    // Wait for new question area to appear after clicking Add Question
    await page.waitForTimeout(3000);
    
    // Locate Fill In The Blank question type in sidebar using specific span locator from DOM
    const fillBlankType = page.locator("//div[contains(@aria-label,'Quiz: Fill In The Blank')]");
    await expect(fillBlankType).toBeVisible({ timeout: 5000 });
    console.log('✅ Fill In The Blank question type is visible in sidebar');
    
    // Locate the drag & drop area for the new question
    const fillBlankDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await expect(fillBlankDragDropArea).toBeVisible({ timeout: 5000 });
    console.log('✅ Drag & Drop area is visible for new question');
    
    // Perform drag and drop operation
    await fillBlankType.dragTo(fillBlankDragDropArea);
    await page.waitForTimeout(3000);
    console.log('✅ Successfully dragged Fill In The Blank question to drag & drop area');
    
    // Verify Fill In The Blank question was added
    const fillBlank = page.getByRole('textbox', { name: 'Type your question here' });
    await expect(fillBlank).toBeVisible({ timeout: 5000 });
    console.log('✅ Fill In The Blank question container appeared after drag & drop');
    
    // Take screenshot of Fill In The Blank question added
    await page.screenshot({ path: 'fill-in-blank-question-added.png', fullPage: true });
    console.log('📸 Screenshot saved: fill-in-blank-question-added.png');
    
    console.log('🎉 Fill In The Blank question drag & drop validation completed successfully!');

    // Step 12: Fill question text for Fill In The Blank question
    console.log('🔍 Adding question text for Fill In The Blank question...');
    await page.waitForTimeout(3000);
    
    const fillInBlankQuestionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await page.waitForTimeout(3000);
    await fillInBlankQuestionInput.click();
    await page.waitForTimeout(2000);
    await fillInBlankQuestionInput.fill('__ In The Blank');
    await page.waitForTimeout(2000);
    console.log('✅ Fill In The Blank question text entered successfully');

    // Step 13: Fill answers for Fill In The Blank question
    console.log('🔍 Adding answers for Fill In The Blank question...');
    
    const fillInBlankAnswersInput = page.getByRole('textbox', { name: 'Enter answer(s) here,' });
    await expect(fillInBlankAnswersInput).toBeVisible({ timeout: 5000 });
    await fillInBlankAnswersInput.click();
    await page.waitForTimeout(2000);
    await fillInBlankAnswersInput.fill('Fill, Complete, Answer');
    await page.waitForTimeout(2000);
    console.log('✅ Fill In The Blank answers entered successfully');

    // Step 14: Update Score for Fill In The Blank question
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

    console.log('🎉 Fill In The Blank question creation workflow completed successfully!');

  });
});