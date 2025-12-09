import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test.describe('Assignment - Validation', () => {
  
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

  test('should validate assignment creation under chapter', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    console.log('\n🧪 TEST: Assignment Validation');
    
    // Step 1: Navigate to Creator LMS Courses
    await page.waitForTimeout(2000);
    const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.waitFor({ state: 'visible', timeout: 10000 });
    await creatorLmsMenu.click();
    
    const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.waitFor({ state: 'visible', timeout: 10000 });
    await coursesSubmenu.click();
    await page.waitForTimeout(3000);
    console.log('✅ Navigated to Creator LMS Courses');
    
    // Step 2: Click "Add Course"
    const createCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await createCourseButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Add Course button');
    
    // Step 3: Select "Start from Scratch"
    const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await page.waitForTimeout(3000);
    console.log('✅ Selected Start from Scratch');
    
    // Step 4: Fill course title
    const courseTitleInput = page.locator("input[placeholder='Enter Course Title']");
    await courseTitleInput.fill('Assignment Test Course');
    await page.waitForTimeout(2000);
    console.log('📝 Entered course title: "Assignment Test Course"');
    
    // Step 5: Fill chapter title
    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Assignment Test Chapter');
    await page.waitForTimeout(2000);
    console.log('📝 Entered chapter title: "Assignment Test Chapter"');
    
    // Step 6: Click "Add Content" button
    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Add Content button');
    
    await page.screenshot({ path: 'add-content-window.png', fullPage: true });
    
    // Step 7: Click Assignment option
    console.log('🔍 Clicking Assignment option...');
    const assignmentOption = page.getByRole('button', { name: 'Assignment Prompt members to' });
    await assignmentOption.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Assignment option');
    
    // Step 8: Validate we are in Assignment window
    console.log('🔍 Validating Assignment window...');
    const assignmentHeading = page.getByRole('heading', { name: 'Assignment', level: 1 });
    await expect(assignmentHeading).toBeVisible({ timeout: 10000 });
    console.log('✅ Assignment window validated - "Assignment" heading is visible');
    
    // Step 9: Validate "Enter assignment title" placeholder
    const assignmentTitleInput = page.getByPlaceholder('Enter assignment title');
    await expect(assignmentTitleInput).toBeVisible({ timeout: 5000 });
    console.log('✅ "Enter assignment title" input field is visible');
    
    // Step 10: Click on "Enter assignment title" placeholder
    console.log('🔍 Clicking on Enter assignment title...');
    await assignmentTitleInput.click();
    await page.waitForTimeout(1000);
    console.log('✅ Clicked on Enter assignment title input field');
    
    // Step 11: Provide assignment title
    console.log('📝 Entering assignment title...');
    await assignmentTitleInput.fill('Assignment Validation Test');
    await page.waitForTimeout(1000);
    console.log('✅ Entered assignment title: "Assignment Validation Test"');
    
    // Step 12: Click on assignment description
    console.log('🔍 Clicking on Enter assignment description...');
    const assignmentDescriptionEditor = page.getByRole('paragraph');
    await assignmentDescriptionEditor.click();
    await page.waitForTimeout(1000);
    console.log('✅ Clicked on Enter assignment description');
    
    // Step 13: Provide assignment description
    console.log('📝 Entering assignment description...');
    await page.keyboard.type('This is a test assignment for validation purposes.');
    await page.waitForTimeout(1000);
    console.log('✅ Entered assignment description');
    
    await page.screenshot({ path: 'assignment-title-description.png', fullPage: true });
    
    // // Step 14: Click Time Limit toggle to enable it
    // console.log('🔍 Clicking Time Limit toggle...');
    // await page.waitForTimeout(2000);
    // // Click the toggle track for Time Limit (third toggle: Prerequisites=0, Drip Settings=1, Time Limit=2)
    // const timeLimitToggle = page.locator('.components-form-toggle__track').nth(2);
    // await timeLimitToggle.click();
    // await page.waitForTimeout(2000);
    // console.log('✅ Clicked Time Limit toggle - enabled');
    
    // await page.screenshot({ path: 'time-limit-enabled.png', fullPage: true });
    
    // // Step 15: Click on Enter time limit placeholder and provide input
    // console.log('🔍 Clicking on Enter time limit input field...');
    // const timeLimitInput = page.locator("input[type='number'][inputmode='numeric']").first();
    // await timeLimitInput.click();
    // await page.waitForTimeout(1000);
    
    // // Step 16: Provide input as 10
    // await timeLimitInput.fill('10');
    // await page.waitForTimeout(1000);
    // console.log('✅ Entered "10" in Time Limit input field');
    
    // // Step 17: Click on Select option dropdown and choose "Week"
    // console.log('🔍 Selecting "Week" from dropdown...');
    // const timeDropdown = page.locator("select.components-select-control__input").first();
    // await timeDropdown.selectOption('Week');
    // await page.waitForTimeout(1000);
    // console.log('✅ Selected "Week" from dropdown');
    
    // await page.screenshot({ path: 'time-limit-configured.png', fullPage: true });
    
    // Step 18: Click Save button
    console.log('🔍 Clicking Save button...');
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Save button');
    
    // Step 19: Validate "Saved Successfully" notification appears
    console.log('🔍 Validating "Saved Successfully" notification...');
    const savedNotification = page.getByText('Saved Successfully').first();
    await expect(savedNotification).toBeVisible({ timeout: 10000 });
    console.log('✅ "Saved Successfully" notification is visible');
    
    await page.screenshot({ path: 'assignment-saved.png', fullPage: true });
    
    // Step 20: Click Preview button and validate in new tab
    console.log('🔍 Clicking Preview button...');
    const [previewPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByRole('button', { name: 'Preview' }).click()
    ]);
    await previewPage.waitForLoadState('load');
    await page.waitForTimeout(2000);
    console.log('✅ Preview page opened in new tab');
    
    // Step 21: Validate assignment title in preview tab
    console.log('🔍 Validating assignment title in preview page...');
    const assignmentTitle = 'Assignment Validation Test';
    const previewAssignmentTitle = previewPage.getByRole('heading', { name: assignmentTitle, level: 1 });
    await expect(previewAssignmentTitle).toBeVisible({ timeout: 10000 });
    console.log(`✅ Assignment title "${assignmentTitle}" is visible in preview page`);
    
    await previewPage.screenshot({ path: 'assignment-preview-validation.png', fullPage: true });
    
    // Close preview tab
    await previewPage.close();
    console.log('✅ Closed preview tab');
    
    // Step 22: Validate Settings section is visible
    const settingsHeading = page.getByRole('heading', { name: 'Settings' });
    await expect(settingsHeading).toBeVisible({ timeout: 5000 });
    console.log('✅ Settings section is visible');
    
    await page.screenshot({ path: 'assignment-window-validated.png', fullPage: true });
    
    console.log('✅ VALIDATION PASSED: Assignment created and validated successfully');
  });
});

test.describe('Assignment Report and Delete Validation', () => {
  
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

  test('should validate assignment report redirection and delete functionality', async ({ page }) => {
    test.setTimeout(180000); // Set timeout to 3 minutes for comprehensive testing
    console.log('\n🧪 TEST: Assignment Report and Delete Validation');
    
    // Step 1: Navigate to Creator LMS Courses
    await page.waitForTimeout(2000);
    const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.waitFor({ state: 'visible', timeout: 10000 });
    await creatorLmsMenu.click();
    
    const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.waitFor({ state: 'visible', timeout: 10000 });
    await coursesSubmenu.click();
    await page.waitForTimeout(3000);
    console.log('✅ Navigated to Creator LMS Courses');
    
    // Step 2: Click Add Course button
    const addCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await addCourseButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Add Course button');
    
    // Step 3: Select Start from Scratch
    const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await page.waitForTimeout(3000);
    console.log('✅ Selected Start from Scratch');
    
    // Step 4: Fill course title
    const courseTitlePlaceholder = page.locator("input[placeholder='Enter Course Title']");
    await expect(courseTitlePlaceholder).toBeVisible();
    const courseTitle = 'Assignment Report and Delete Test Course';
    await courseTitlePlaceholder.click();
    await courseTitlePlaceholder.fill(courseTitle);
    console.log('📝 Entered course title: "Assignment Report and Delete Test Course"');
    
    // Step 5: Fill chapter title
    const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
    await chapterNamePlaceholder.click();
    const chapterTitle = 'Assignment Report and Delete Test Chapter';
    await chapterNamePlaceholder.fill(chapterTitle);
    console.log('📝 Entered chapter title: "Assignment Report and Delete Test Chapter"');
    
    // Step 6: Click "Add Content" button
    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Add Content button');
    
    // Step 7: Click Assignment option
    console.log('🔍 Clicking Assignment option...');
    const assignmentOption = page.getByRole('button', { name: 'Assignment Prompt members to' });
    await assignmentOption.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Assignment option');
    
    // Step 8: Fill basic assignment details
    const assignmentTitleInput = page.getByPlaceholder('Enter assignment title');
    await assignmentTitleInput.fill('Test Assignment for Report and Delete');
    await page.waitForTimeout(1000);
    console.log('✅ Entered assignment title');
    
    const assignmentDescriptionEditor = page.getByRole('paragraph');
    await assignmentDescriptionEditor.click();
    await page.keyboard.type('This assignment will be used to test report redirection and delete functionality.');
    await page.waitForTimeout(2000);
    console.log('✅ Entered assignment description');

    // Step 9: Save the assignment first
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Clicked Save button');
    
    // Validate save success
    const savedNotification = page.getByText('Saved Successfully').first();
    await expect(savedNotification).toBeVisible({ timeout: 10000 });
    console.log('✅ Assignment saved successfully');

    // ==========================================
    // REPORT REDIRECTION VALIDATION
    // ==========================================
    console.log('\n🔧 TESTING: Report Redirection Functionality');
    
    // Click Report button from top right
    console.log('🔍 Clicking Report button...');
    const reportButton = page.locator("//button[normalize-space()='Report']");
    await expect(reportButton).toBeVisible({ timeout: 10000 });
    
    // Open report in new tab
    const [reportPage] = await Promise.all([
      page.context().waitForEvent('page'),
      reportButton.click()
    ]);
    await reportPage.waitForLoadState('load');
    await page.waitForTimeout(3000);
    console.log('✅ Report button clicked - new tab opened');
    
    // Validate redirection to new tab
    const reportPageTitle = await reportPage.title();
    console.log(`✅ Report page opened with title: "${reportPageTitle}"`);
    
    // Validate Result is visible (ss2 equivalent)
    console.log('🔍 Validating Result visibility...');
    const resultSpan = reportPage.locator("//span[normalize-space()='Result']");
    await expect(resultSpan).toBeVisible({ timeout: 10000 });
    console.log('✅ Result span is visible in report page');
    
    // Take screenshot equivalent to ss2
    await reportPage.screenshot({ path: 'ss2-report-result-visible.png', fullPage: true });
    console.log('📸 Screenshot saved: ss2-report-result-visible.png');
    
    // Close the report tab
    await reportPage.close();
    console.log('✅ Closed report tab');
    
    // Validate return to assignment tab
    await page.waitForTimeout(2000);
    const assignmentHeading = page.getByRole('heading', { name: 'Assignment', exact: true }).first();
    await expect(assignmentHeading).toBeVisible({ timeout: 5000 });
    console.log('✅ Successfully returned to assignment tab');

    // ==========================================
    // DELETE ASSIGNMENT VALIDATION
    // ==========================================
    console.log('\n🔧 TESTING: Delete Assignment Functionality');
    
    // Click Delete Assignment button
    console.log('🔍 Clicking Delete Assignment button...');
    const deleteAssignmentButton = page.locator("//button[normalize-space()='Delete Assignment']");
    await expect(deleteAssignmentButton).toBeVisible({ timeout: 10000 });
    await deleteAssignmentButton.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Delete Assignment button');
    
    // Validate delete assignment window appears
    console.log('🔍 Validating delete assignment window...');
    const deleteDialog = page.getByRole('dialog', { name: 'Delete Assignment' });
    await expect(deleteDialog).toBeVisible({ timeout: 5000 });
    console.log('✅ Delete assignment window is visible');
    
    // Click Delete button in the window
    console.log('🔍 Clicking Delete button in confirmation window...');
    const deleteConfirmButton = page.getByRole('button', { name: 'Delete' }).or(page.locator("//button[normalize-space()='Delete']"));
    await expect(deleteConfirmButton).toBeVisible({ timeout: 5000 });
    await deleteConfirmButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Clicked Delete confirmation button');
    
    // Validate window closes and course builder is visible
    console.log('🔍 Validating course builder visibility...');
    const courseBuilderIndicator = page.getByText('Course Builder').or(page.getByText(chapterTitle)).or(page.getByText(courseTitle));
    await expect(courseBuilderIndicator).toBeVisible({ timeout: 10000 });
    console.log('✅ Course builder is visible after deletion');
    
    // Validate chapter title is visible
    console.log('🔍 Validating chapter title visibility...');
    const chapterTitleElement = page.getByText(chapterTitle);
    await expect(chapterTitleElement).toBeVisible({ timeout: 5000 });
    console.log('✅ Chapter title is visible in course builder');
    
    // Validate assignment no longer exists under the chapter
    console.log('� Validating assignment is deleted from chapter...');
    const deletedAssignmentTitle = page.getByText('Test Assignment for Report and Delete');
    
    // Use a try-catch to confirm assignment is NOT visible
    try {
      await expect(deletedAssignmentTitle).toBeVisible({ timeout: 3000 });
      console.log('❌ ERROR: Assignment still exists - deletion failed');
      throw new Error('Assignment was not properly deleted');
    } catch (error) {
      if (error.message.includes('not properly deleted')) {
        throw error;
      }
      console.log('✅ Assignment successfully deleted - no longer visible under chapter');
    }

    // ==========================================
    // TEST COMPLETION SUMMARY
    // ==========================================
    console.log('\n🎉 REPORT AND DELETE VALIDATION SUMMARY:');
    console.log('✅ Assignment Created: Test Assignment for Report and Delete');
    console.log('✅ Report Button: Redirected to new tab successfully');
    console.log('✅ Result Visibility: Confirmed in report page (ss2)');
    console.log('✅ Tab Management: Successfully returned to assignment tab');
    console.log('✅ Delete Window: Appeared and functioned correctly');
    console.log('✅ Course Builder: Visible after deletion');
    console.log('✅ Chapter Title: Visible in course builder');
    console.log('✅ Assignment Deletion: Confirmed - no longer exists under chapter');
    
    console.log('\n🏆 ASSIGNMENT REPORT AND DELETE VALIDATION TEST PASSED!');
  });
});
