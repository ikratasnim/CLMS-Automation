import { test, expect } from '@playwright/test';

const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test('Create Audio Type Lesson in Course', async ({ page }, testInfo) => {

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
  await courseTitlePlaceholder.fill('Audio Lesson Creation Course');

  console.log('✅ Course name provided: Audio Lesson Creation Course');

  // Find the 'Enter chapter name' placeholder text and click on it
  const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
  await chapterNamePlaceholder.click();

  // Provide chapter name
  await chapterNamePlaceholder.fill('Chapter 1: Audio-Based Learning');
  await page.waitForTimeout(3000);

  console.log('✅ Chapter name provided: Chapter 1: Audio-Based Learning');

  // AUDIO TYPE CONTENT CREATION PART STARTS HERE
  // Click on the 'Add content' button for Audio type lesson
  const addContentButtonAudio = page.locator("button", { hasText: 'Add content' });
  await addContentButtonAudio.click();
  await page.waitForTimeout(3000);

  console.log('✅ Add Content page opened');

  // Find and click on the 'Audio' type component
  const audioTypeComponent = page.getByRole('button', { name: 'Audio Deliver audio content' });
  await audioTypeComponent.click();
  await page.waitForTimeout(3000);

  // Validate if 'Audio' h1 component is visible
  const audioHeading = page.locator("h1", { hasText: 'Audio' });
  await expect(audioHeading).toBeVisible();
  await page.waitForTimeout(5000);

  console.log('✅ Audio lesson type selected');

  const AudioLessonTitle = 'The Spectrum of Validation: Differentiating Functional and Non-Functional Testing Types';
  await page.waitForTimeout(3000);

  // Find the 'Enter lesson title' placeholder text and click on it for audio type lesson
  const AudioLessonTitlePlaceholder = page.locator("input[placeholder='Enter lesson title']");
  await page.waitForTimeout(3000);
  await AudioLessonTitlePlaceholder.click();
  await page.waitForTimeout(3000);
  // Fill the 'Enter lesson title' field with the specified text
  await AudioLessonTitlePlaceholder.fill(AudioLessonTitle);
  await page.waitForTimeout(5000);

  console.log(`✅ Audio lesson title provided: ${AudioLessonTitle}`);

  // Find the 'Enter lesson description...' field and click on it
  const AudioDescriptionField = page.getByRole('paragraph').filter({ hasText: /^$/ });
  await page.waitForTimeout(3000);
  await AudioDescriptionField.click();
  await page.waitForTimeout(5000);

  // Fill the 'Enter lesson description...' field with the specified text
  await AudioDescriptionField.fill(
    'This audio lesson explores the two main categories of software testing: Functional Testing and Non-Functional Testing. You will learn how functional testing verifies that specific features and functions work as expected. In contrast, non-functional testing assesses aspects that affect user experience but are not about specific features, such as performance, security, usability, and compatibility. Understanding these distinctions is crucial for comprehensive test planning and execution.'
  );
  await page.waitForTimeout(3000);

  console.log('✅ Audio lesson description added');
  
  // Click on Select Audio button
  const selectAudioButton = page.locator("//button[@class='components-button is-primary'][normalize-space()='Select audio']");
  await page.waitForTimeout(3000);
  await selectAudioButton.click();
  await page.waitForTimeout(3000);
  
  // Select 'Add from local' button from the dropdown
  const addFromLocalButton = page.locator("//span[normalize-space()='Add from local']");
  await page.waitForTimeout(3000);
  await addFromLocalButton.click();
  await page.waitForTimeout(3000);

  console.log('✅ Selected Add from local option');
  
  // Click on Media Library for audio type lesson
  const audioMediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
  await audioMediaLibraryTab.click();
  await page.waitForTimeout(2000);

  // Select a random audio file from media library
  const audioFiles = page.locator('.attachment-preview[data-type="audio"]');
  const audioCount = await audioFiles.count();
  
  if (audioCount > 0) {
    // Select a random audio file
    const randomAudioIndex = Math.floor(Math.random() * audioCount);
    const randomAudio = audioFiles.nth(randomAudioIndex);
    await randomAudio.scrollIntoViewIfNeeded();
    await randomAudio.waitFor({ state: 'visible', timeout: 5000 });
    await randomAudio.click({ force: true });
    await page.waitForTimeout(2000);
    
    console.log(`✅ Selected random audio file (index: ${randomAudioIndex})`);
  } else {
    // Fallback: Try to select any available audio file by using more specific selector
    const firstAudio = page.locator('.attachment-preview').first();
    await firstAudio.scrollIntoViewIfNeeded();
    await firstAudio.waitFor({ state: 'visible', timeout: 5000 });
    await firstAudio.click({ force: true });
    await page.waitForTimeout(2000);
    
    console.log('✅ Selected fallback audio file');
  }

  // Click on the specified button for audio type lesson
  const specifiedButtonAudio = page.getByRole('button', { name: 'Use this media' });
  await specifiedButtonAudio.click();
  await page.waitForTimeout(3000);

  console.log('✅ Audio file selected and applied');

  // Click on the 'Save' button from the top right corner for audio type lesson
  const audioSaveButton = page.locator("button", { hasText: 'Save' });
  await audioSaveButton.click();
  await page.waitForTimeout(3000);

  console.log('✅ Audio lesson saved successfully');

  // Validate if clicking the 'Preview' button redirects to a new tab for audio type lesson
  const [newaudioPreviewPage] = await Promise.all([
    page.context().waitForEvent('page'), // Wait for a new page to open
    page.locator("button.components-button.crlms-preview-btn", { hasText: 'Preview' }).click() // Click the specific 'Preview' button
  ]);
  await newaudioPreviewPage.waitForLoadState(); // Wait for the new page to load
  expect(newaudioPreviewPage.url()).not.toBe(page.url()); // Validate the URL is different from the current page

  // Validate if the h1 tag in the new page matches the lessonTitlePlaceholder input value for audio type lesson
  const newaudioPreviewPageHeading = newaudioPreviewPage.locator("h1");
  await expect(newaudioPreviewPageHeading).toHaveText(AudioLessonTitle);

  console.log('✅ Preview validation successful - audio lesson title matches');

  // Close the new tab and switch back to the previous tab
  await newaudioPreviewPage.close();
  await page.bringToFront();

  // Validate if the h1 component with text 'Audio' is present
  const audioHeadingAfterSwitch = page.locator("h1", { hasText: 'Audio' });
  await expect(audioHeadingAfterSwitch).toBeVisible();

  // Click on the close button beside the save button at the top right corner for audio type lesson
  const closeButtonaudio = page.locator("//button[@aria-label='Close']//*[name()='svg']");
  await closeButtonaudio.click();
  await page.waitForTimeout(3000);

  console.log('✅ Audio lesson creation completed successfully and closed');
  console.log('📋 Summary: Created an audio-based lesson with title, description, and audio file from media library');

});