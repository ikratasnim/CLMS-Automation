import { test, expect } from '@playwright/test';

const adminURL = 'http://creator-lms-automation.local/';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test('Lesson drag & drop test', async ({ page }, testInfo) => {

  await page.goto(adminLoginURL);
  // Fill in username and password
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');

  // Wait for navigation to wp-admin
  await page.waitForURL('**/wp-admin/**');

  // Assert that the admin bar is visible (login successful)
  await expect(page.locator('#wpadminbar')).toBeVisible();


  // Hover on Creator LMS from the WordPress menubar and click on Courses
  const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
  await creatorLmsMenu.hover();
  const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
  await coursesSubmenu.click();

  // Wait for the Courses page to load
  await page.waitForTimeout(3000);

  // Validate if on All Courses page
  const allCoursesHeading = page.locator("//h1[normalize-space()='All Courses']");
  await expect(allCoursesHeading).toBeVisible();

  // Click on Add Course button and wait for the page to load
  const addCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
  await addCourseButton.click();
  await page.waitForTimeout(3000);

  // Click 'Start from Scratch' option and wait for the page to load
  const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
  await startFromScratchOption.click();
  await page.waitForTimeout(5000);

  // Validate if 'Enter Course Title' placeholder is visible after redirection
  const courseTitlePlaceholder = page.locator("input[placeholder='Enter Course Title']");
  await page.waitForTimeout(3000);  
  await expect(courseTitlePlaceholder).toBeVisible();


  // Click on the 'Enter Course Title' placeholder and input the course title
  await courseTitlePlaceholder.click();
  await courseTitlePlaceholder.fill('Lesson drag and drop test');

  // Validate if the course title is successfully entered
  const enteredTitle = await courseTitlePlaceholder.inputValue();
  expect(enteredTitle).toBe('Lesson drag and drop test');

 await page.waitForTimeout(3000);

   //chapter 1 addition
  // Find the 'Enter chapter name' placeholder text and click on it
  const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
  await page.waitForTimeout(3000);
  await chapterNamePlaceholder.click();

  // Input 'Chapter 1' into the 'Enter chapter name' field
  await chapterNamePlaceholder.fill('Chapter 1');
  await page.waitForTimeout(3000);
  
  // Click on the 'Add content' button
  const addContentButton = page.locator("button", { hasText: 'Add content' });
  await addContentButton.click();
  await page.waitForTimeout(3000);

  // Validate if 'Add Content' h1 tag is visible
  const addContentHeading = page.locator("h1", { hasText: 'Add Content' });
  await expect(addContentHeading).toBeVisible();

  // Find and click on the 'Text' type component
  const textTypeComponent = page.getByRole('button', { name: 'Text Create text-based' });
  await textTypeComponent.click();
  await page.waitForTimeout(5000);

  // Validate if 'Text' h1 component is visible
  const textHeading = page.locator("h1", { hasText: 'Text' });
  await page.waitForTimeout(5000);
  await expect(textHeading).toBeVisible();

  // Find the 'Enter lesson title' placeholder text and click on it
  const lessonTitlePlaceholder = page.locator("input[placeholder='Enter lesson title']");
  await lessonTitlePlaceholder.click();
  const lessonTitle = 'Text type lesson';

  // Fill the 'Enter lesson title' field with the specified text
  await lessonTitlePlaceholder.fill(lessonTitle);
  await page.waitForTimeout(5000);
  // Click on the 'Save' button from the top right corner
  const saveButton = page.locator("button", { hasText: 'Save' });
  await saveButton.click();
  await page.waitForTimeout(5000);
  // Click on the close button beside the save button at the top right corner
  const closeButton = page.locator("//button[@aria-label='Close']//*[name()='svg']").first();
  await page.waitForTimeout(5000);
  await closeButton.click();
  await page.waitForTimeout(5000);

    // Click on the 'Add content' button
  const addContentButtonV = page.locator("button", { hasText: 'Add content' });
  await addContentButtonV.click();
  await page.waitForTimeout(3000);
  // Find and click on the 'Video' type component
  const videoTypeComponent = page.getByRole('button', { name: 'Video Deliver video content' });
  await videoTypeComponent.click();
  await page.waitForTimeout(5000);

  // Validate if 'Video' h1 component is visible
  const videoHeading = page.locator("h1", { hasText: 'Video' });
  await page.waitForTimeout(5000);
  await expect(videoHeading).toBeVisible();
  await page.waitForTimeout(3000);

    // Find the 'Enter lesson title' placeholder text and click on it
  const VlessonTitlePlaceholder = page.locator("input[placeholder='Enter lesson title']");
  await VlessonTitlePlaceholder.click();
  await page.waitForTimeout(3000);
  const VlessonTitle = 'Video type lesson';
  // Fill the 'Enter lesson title' field with the specified text
  await VlessonTitlePlaceholder.fill(VlessonTitle);
  await page.waitForTimeout(5000);
  // Click on the 'Save' button from the top right corner
  const VsaveButton = page.locator("button", { hasText: 'Save' });
  await VsaveButton.click();
  await page.waitForTimeout(3000);
  // Click on the close button beside the save button at the top right corner
  const closeButtonV = page.locator("//button[@aria-label='Close']//*[name()='svg']").first();
  await page.waitForTimeout(3000);
  await closeButtonV.click();
  await page.waitForTimeout(3000);

  // Now perform lesson drag and drop
  // Store both lesson positions from the sidebar before drag and drop
  const lesson1Element = page.locator("//*[contains(text(), 'Text type lesson')]").first();
  await page.waitForTimeout(3000);
  const lesson2Element = page.locator("//*[contains(text(), 'Video type lesson')]").first();
  await page.waitForTimeout(3000);
  
  // Wait for both lessons to be visible in the sidebar
  await expect(lesson1Element).toBeVisible();
  await page.waitForTimeout(3000);
  await expect(lesson2Element).toBeVisible();
  await page.waitForTimeout(3000);
  
  // Get initial positions/order of lessons
  const initialLesson1Position = await lesson1Element.boundingBox();
  await page.waitForTimeout(3000);
  const initialLesson2Position = await lesson2Element.boundingBox();
  await page.waitForTimeout(3000);
  
  console.log('Initial Lesson 1 position:', initialLesson1Position);
  console.log('Initial Lesson 2 position:', initialLesson2Position);
  
  // Validate initial order (Lesson 1 should be above Lesson 2)
  await page.waitForTimeout(3000);
  expect(initialLesson1Position.y).toBeLessThan(initialLesson2Position.y);
  
  // Perform drag and drop: Move Lesson 2 to first position (above Lesson 1)
  await page.waitForTimeout(5000);
  
  // Drag Lesson 2 to the position of Lesson 1
  await lesson2Element.dragTo(lesson1Element);
  await page.waitForTimeout(3000);
  
  // Validate the drag and drop operation by checking new positions
  const finalLesson1Position = await lesson1Element.boundingBox();
  await page.waitForTimeout(3000);
  const finalLesson2Position = await lesson2Element.boundingBox();
  await page.waitForTimeout(3000);
  
  console.log('Final Lesson 1 position:', finalLesson1Position);
  console.log('Final Lesson 2 position:', finalLesson2Position);
  
  // Validate that positions have swapped (Lesson 2 should now be above Lesson 1)
  await page.waitForTimeout(3000);
  expect(finalLesson2Position.y).toBeLessThan(finalLesson1Position.y);
  await page.waitForTimeout(3000);
  
  // Additional validation: Check the order in the DOM
  const lessonsAfterDrop = page.locator("//*[text()='Text type lesson' or text()='Video type lesson']");
  await page.waitForTimeout(3000);
  const firstLessonText = await lessonsAfterDrop.first().textContent();
  await page.waitForTimeout(3000);
  const lastLessonText = await lessonsAfterDrop.last().textContent();
  await page.waitForTimeout(3000);
  
  // Validate that Video lesson is now first and Text lesson is last
  expect(firstLessonText).toContain('Video type lesson');
  await page.waitForTimeout(3000);
  expect(lastLessonText).toContain('Text type lesson');
  
  console.log('Lesson drag and drop validation successful: Video lesson is now first, Text lesson is last');
  
  // Click on the 3 dots menu beside the Next button
  await page.waitForTimeout(3000);
  const threeDotsMenu = page.locator("//div[@class='components-dropdown components-dropdown-menu crlms-more-options-dropdown']//button[@type='button']//*[name()='svg']");
  await page.waitForTimeout(3000);
  await threeDotsMenu.click();
  await page.waitForTimeout(3000);

  // Click on "Save as Draft" option
  const saveAsDraftOption = page.locator("//span[normalize-space()='Save as Draft']");
  await page.waitForTimeout(3000);
  await saveAsDraftOption.click();
  await page.waitForTimeout(3000);

  console.log('Successfully saved course as draft');

  // Reload the page using browser reload button
  console.log('Reloading the page to validate lesson positions persistence...');
  await page.reload();
  await page.waitForTimeout(5000);

  // Wait for the page to fully load after reload
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Re-locate the lesson elements after page reload
  const reloadedLesson1Element = page.locator("//*[contains(text(), 'Text type lesson')]").first();
  await page.waitForTimeout(3000);
  const reloadedLesson2Element = page.locator("//*[contains(text(), 'Video type lesson')]").first();
  await page.waitForTimeout(3000);

  // Wait for both lessons to be visible after reload
  await expect(reloadedLesson1Element).toBeVisible();
  await page.waitForTimeout(3000);
  await expect(reloadedLesson2Element).toBeVisible();
  await page.waitForTimeout(3000);

  // Get positions after page reload
  const reloadedLesson1Position = await reloadedLesson1Element.boundingBox();
  await page.waitForTimeout(3000);
  const reloadedLesson2Position = await reloadedLesson2Element.boundingBox();
  await page.waitForTimeout(3000);

  console.log('After reload - Lesson 1 position:', reloadedLesson1Position);
  console.log('After reload - Lesson 2 position:', reloadedLesson2Position);

  // Validate that the dragged order is maintained after reload
  // Video lesson should still be above Text lesson
  expect(reloadedLesson2Position.y).toBeLessThan(reloadedLesson1Position.y);

  // Additional validation: Check the DOM order after reload
  const lessonsAfterReload = page.locator("//*[text()='Text type lesson' or text()='Video type lesson']");
  await page.waitForTimeout(3000);
  const firstLessonAfterReload = await lessonsAfterReload.first().textContent();
  await page.waitForTimeout(3000);
  const lastLessonAfterReload = await lessonsAfterReload.last().textContent();
  await page.waitForTimeout(3000);

  // Validate that Video lesson is still first and Text lesson is still last after reload
  expect(firstLessonAfterReload).toContain('Video type lesson');
  expect(lastLessonAfterReload).toContain('Text type lesson');

  console.log('✅ SUCCESS: Lesson positions are persistent after page reload!');
  console.log('✅ Video lesson remains first, Text lesson remains last');
  
});
