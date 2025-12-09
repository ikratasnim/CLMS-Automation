import { test, expect } from '@playwright/test';

const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test('Create Text Type Lesson in Course', async ({ page }, testInfo) => {

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
  await courseTitlePlaceholder.fill('Text Lesson Creation Course');

  console.log('✅ Course name provided: Text Lesson Creation Course');

  // Find the 'Enter chapter name' placeholder text and click on it
  const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
  await chapterNamePlaceholder.click();

  // Provide chapter name
  await chapterNamePlaceholder.fill('Chapter 1: Text-Based Learning');
  await page.waitForTimeout(3000);

  console.log('✅ Chapter name provided: Chapter 1: Text-Based Learning');

  // TEXT TYPE CONTENT CREATION PART STARTS HERE
  // Click on the 'Add content' button for Text type lesson
  const addContentButton = page.locator("button", { hasText: 'Add content' });
  await addContentButton.click();
  await page.waitForTimeout(3000);

  // Validate if 'Add Content' h1 tag is visible
  const addContentHeading = page.locator("h1", { hasText: 'Add Content' });
  await expect(addContentHeading).toBeVisible();

  console.log('✅ Add Content page opened');

  // Find and click on the 'Text' type component
  const textTypeComponent = page.getByRole('button', { name: 'Text Create text-based' });
  await textTypeComponent.click();
  await page.waitForTimeout(3000);

  // Validate if 'Text' h1 component is visible
  const textHeading = page.locator("h1", { hasText: 'Text' });
  await expect(textHeading).toBeVisible();

  console.log('✅ Text lesson type selected');

  // Find the 'Enter lesson title' placeholder text and click on it
  const lessonTitlePlaceholder = page.locator("input[placeholder='Enter lesson title']");
  await lessonTitlePlaceholder.click();
  const lessonTitle = 'Understanding Software Testing Fundamentals';

  // Fill the 'Enter lesson title' field with the specified text
  await lessonTitlePlaceholder.fill(lessonTitle);
  await page.waitForTimeout(3000);

  console.log(`✅ Lesson title provided: ${lessonTitle}`);

  // Find the 'Enter lesson description...' field and click on it
  const lessonDescriptionField = page.getByRole('paragraph');
  await page.waitForTimeout(5000);
  await lessonDescriptionField.click();

  // Fill the 'Enter lesson description...' field with the specified text
  await lessonDescriptionField.fill(
    'This lesson provides a comprehensive introduction to software testing, defining its purpose beyond just finding bugs – focusing on validating functionality, improving user experience, and ensuring overall product quality. We will explore the fundamental principles of testing and how testing fits within the broader context of Quality Assurance (QA).'
  );
  await page.waitForTimeout(3000);

  console.log('✅ Lesson description added');
  
  // Click on the 'Add cover image' button
  const addCoverImageButton = page.getByRole('button', { name: 'Add cover image' });
  await addCoverImageButton.click();
  await page.waitForTimeout(3000);
  
  // Click on the Media Library tab of Select or Upload Media
  const mediaLibraryTabtext = page.getByRole('tab', { name: 'Media Library' });
  await mediaLibraryTabtext.click();
  await page.waitForTimeout(5000);
  
  // Select an image randomly
  const randomImageIndex = Math.floor(Math.random() * await page.locator(".attachment-preview img").count());
  await page.waitForTimeout(3000);
  const randomImage = page.locator(".attachment-preview img").nth(randomImageIndex);
  await randomImage.scrollIntoViewIfNeeded(); // Ensure the element is in view
  await randomImage.waitFor({ state: 'visible', timeout: 5000 }); // Wait explicitly for visibility
  await randomImage.click({ force: true }); // Force the click action to bypass obstructions
  await page.waitForTimeout(3000);
  
  // Click on the 'Use this media' button
  const useThisMediaButtontext = page.getByRole('button', { name: 'Use this media' });
  await useThisMediaButtontext.click();
  await page.waitForTimeout(3000);

  console.log('✅ Cover image added to lesson');
  
  // Click on the '+' icon to add content
  const plusIcon = page.getByLabel('Scrollable section').getByRole('button').filter({ hasText: /^$/ }).nth(1);
  await plusIcon.click();
  await page.waitForTimeout(3000);
  
  // Click on 'Image' from the dropdown
  const imageOption = page.getByRole('button', { name: 'Image', exact: true });
  await imageOption.click();
  await page.waitForTimeout(3000);

  // Click on the Media Library tab of Select or Upload Media
  const mediaLibraryTab1 = page.getByRole('tab', { name: 'Media Library' });
  await mediaLibraryTab1.click();
  await page.waitForTimeout(3000);
  
  // Select a random image
  const randomImageIndex1 = Math.floor(Math.random() * await page.locator(".attachment-preview img").count());
  await page.waitForTimeout(3000);
  const randomImage1 = page.locator(".attachment-preview img").nth(randomImageIndex1);
  await randomImage1.scrollIntoViewIfNeeded(); // Ensure the element is in view
  await randomImage1.waitFor({ state: 'visible', timeout: 5000 }); // Wait explicitly for visibility
  await randomImage1.click({ force: true }); // Force the click action to bypass obstructions
  await page.waitForTimeout(3000);
  
  // Click on the 'Use this media' button
  const useThisMediaButton1 = page.getByRole('button', { name: 'Use this media' });
  await useThisMediaButton1.click();
  await page.waitForTimeout(3000);

  console.log('✅ Additional image content added to lesson');
  
  // Click on the 'Save' button from the top right corner
  const saveButton = page.locator("button", { hasText: 'Save' });
  await saveButton.click();
  await page.waitForTimeout(3000);

  console.log('✅ Text lesson saved successfully');

  // Validate if clicking the 'Preview' button redirects to a new tab
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'), // Wait for a new page to open
    page.locator("button.components-button.crlms-preview-btn", { hasText: 'Preview' }).click() // Click the specific 'Preview' button
  ]);
  await newPage.waitForLoadState(); // Wait for the new page to load
  expect(newPage.url()).not.toBe(page.url()); // Validate the URL is different from the current page

  // Validate if the h1 tag in the new page matches the lessonTitlePlaceholder input value
  const newPageHeading = newPage.locator("h1");
  await expect(newPageHeading).toHaveText(lessonTitle);

  console.log('✅ Preview validation successful - lesson title matches');

  // Close the new tab and switch back to the previous tab
  await newPage.close();
  await page.bringToFront();

  // Validate if the h1 component with text 'Text' is present
  const textHeadingAfterSwitch = page.locator("h1", { hasText: 'Text' });
  await expect(textHeadingAfterSwitch).toBeVisible();

  // Click on the close button beside the save button at the top right corner
  const closeButton = page.locator("//button[@aria-label='Close']//*[name()='svg']");
  await closeButton.click();
  await page.waitForTimeout(3000);

  console.log('✅ Text lesson creation completed successfully and closed');
  console.log('📋 Summary: Created a text-based lesson with title, description, cover image, and additional content');

});