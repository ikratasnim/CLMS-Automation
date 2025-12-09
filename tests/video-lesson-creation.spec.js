import { test, expect } from '@playwright/test';

const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test('Create Video Type Lesson in Course', async ({ page }, testInfo) => {

  // Login to WordPress admin panel
  await page.goto(adminLoginURL);
  // Fill in username and password
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');

  // Wait for navigation to wp-admin
  await page.waitForURL('**/wp-admin/**');

  // Assert that the admin bar is visible (login successful)
  await expect(page.locator('#wpadminbar')).toBeVisible();

  console.log('✅ Successfully logged into WordPress admin panel');

  // Hover on Creator LMS from the WordPress menubar and click on Courses
  const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
  await creatorLmsMenu.hover();
  const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
  await coursesSubmenu.click();

  // Wait for the Courses page to load
  await page.waitForTimeout(3000);

  console.log('✅ Navigated to Courses page');

  // Click on Add Course button and wait for the page to load
  const addCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
  await addCourseButton.click();
  await page.waitForTimeout(3000);

  // Click 'Start from Scratch' option and wait for the page to load
  const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
  await startFromScratchOption.click();
  await page.waitForTimeout(3000);

  console.log('✅ Selected Start from Scratch option');

  // Validate if 'Enter Course Title' placeholder is visible after redirection
  const courseTitlePlaceholder = page.locator("input[placeholder='Enter Course Title']");
  await expect(courseTitlePlaceholder).toBeVisible();

  // Provide course name
  await courseTitlePlaceholder.click();
  await courseTitlePlaceholder.fill('Video Lesson Creation Course');

  console.log('✅ Course name provided: Video Lesson Creation Course');

  // Find the 'Enter chapter name' placeholder text and click on it
  const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
  await chapterNamePlaceholder.click();

  // Provide chapter name
  await chapterNamePlaceholder.fill('Chapter 1: Video-Based Learning');
  await page.waitForTimeout(3000);

  console.log('✅ Chapter name provided: Chapter 1: Video-Based Learning');

  // VIDEO TYPE CONTENT CREATION PART STARTS HERE
  // Click on the 'Add content' button for Video type lesson
  const addContentButtonV = page.locator("button", { hasText: 'Add content' });
  await addContentButtonV.click();
  await page.waitForTimeout(3000);

  console.log('✅ Add Content page opened');

  // Find and click on the 'Video' type component
  const videoTypeComponent = page.getByRole('button', { name: 'Video Deliver video content' });
  await videoTypeComponent.click();
  await page.waitForTimeout(3000);

  // Validate if 'Video' h1 component is visible
  const videoHeading = page.locator("h1", { hasText: 'Video' });
  await expect(videoHeading).toBeVisible();
  await page.waitForTimeout(5000);

  console.log('✅ Video lesson type selected');

  const VlessonTitle = 'Navigating the Process: Understanding SDLC and STLC in Software Development';
  await page.waitForTimeout(3000);

  // Find the 'Enter lesson title' placeholder text and click on it
  const VlessonTitlePlaceholder = page.locator("input[placeholder='Enter lesson title']");
  await page.waitForTimeout(3000);
  await VlessonTitlePlaceholder.click();
  await page.waitForTimeout(3000);
  // Fill the 'Enter lesson title' field with the specified text
  await VlessonTitlePlaceholder.fill(VlessonTitle);
  await page.waitForTimeout(5000);

  console.log(`✅ Video lesson title provided: ${VlessonTitle}`);

  // Find the 'Enter lesson description...' field and click on it
  const VlessonDescriptionField = page.getByRole('paragraph').filter({ hasText: /^$/ });
  await page.waitForTimeout(3000);
  await VlessonDescriptionField.click();
  await page.waitForTimeout(5000);

  // Fill the 'Enter lesson description...' field with the specified text
  await VlessonDescriptionField.fill(
    'This video lesson dives into the interconnected processes of the Software Development Life Cycle (SDLC) and the Software Testing Life Cycle (STLC). You will learn about the different phases of SDLC and how STLC seamlessly integrates within it. The lesson will highlight the importance of involving testers early in the SDLC to achieve better quality outcomes and efficient project delivery.'
  );
  await page.waitForTimeout(3000);

  console.log('✅ Video lesson description added');
  
  // Click on Select Video button
  const selectVideoButton = page.locator("//button[@class='components-button is-primary'][normalize-space()='Select video']");
  await page.waitForTimeout(3000);
  await selectVideoButton.click();
  await page.waitForTimeout(3000);
  
  // Select 'Add from external URL' button from the dropdown
  const addFromExternalURLButton = page.locator("//span[normalize-space()='Add From external URL']");
  await page.waitForTimeout(3000);
  await addFromExternalURLButton.click();
  await page.waitForTimeout(3000);
  
  // Click on enter URL input field and fill it with the specified URL
  const urlInputField = page.getByRole('textbox', { name: 'Enter URL' });
  await page.waitForTimeout(3000);
  await urlInputField.click();
  await page.waitForTimeout(3000);
  await urlInputField.fill('https://www.youtube.com/live/sO8eGL6SFsA?si=IvAnD7nSbRbwPng3');
  await page.waitForTimeout(3000);

  console.log('✅ External video URL added');

  // Click on the Save URL button
  const saveUrlButton = page.locator("//button[normalize-space()='Save URL']");
  await saveUrlButton.click();
  await page.waitForTimeout(3000);

  console.log('✅ Video URL saved successfully');

  // Click on the 'Save' button from the top right corner
  const VsaveButton = page.locator("button", { hasText: 'Save' });
  await VsaveButton.click();
  await page.waitForTimeout(3000);

  console.log('✅ Video lesson saved successfully');

  // Validate if clicking the 'Preview' button redirects to a new tab
  const [newPreviewPage] = await Promise.all([
    page.context().waitForEvent('page'), // Wait for a new page to open
    page.locator("button.components-button.crlms-preview-btn", { hasText: 'Preview' }).click() // Click the specific 'Preview' button
  ]);
  await newPreviewPage.waitForLoadState(); // Wait for the new page to load
  expect(newPreviewPage.url()).not.toBe(page.url()); // Validate the URL is different from the current page

  // Validate if the h1 tag in the new page matches the lessonTitlePlaceholder input value
  const newPreviewPageHeading = newPreviewPage.locator("h1");
  await expect(newPreviewPageHeading).toHaveText(VlessonTitle);

  console.log('✅ Preview validation successful - video lesson title matches');

  // Close the new tab and switch back to the previous tab
  await newPreviewPage.close();
  await page.bringToFront();

  // Validate if the h1 component with text 'Video' is present
  const videoHeadingAfterSwitch = page.locator("h1", { hasText: 'Video' });
  await expect(videoHeadingAfterSwitch).toBeVisible();

  // Click on the close button beside the save button at the top right corner
  const closeButtonV = page.locator("//button[@aria-label='Close']//*[name()='svg']");
  await closeButtonV.click();
  await page.waitForTimeout(3000);

  console.log('✅ Video lesson creation completed successfully and closed');
  console.log('📋 Summary: Created a video-based lesson with title, description, and external video URL');

});