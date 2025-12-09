import { test, expect } from '@playwright/test';

const adminURL = 'http://creator-lms-automation.local/';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test('Chapter drag & drop test', async ({ page }, testInfo) => {

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
  await page.waitForTimeout(3000);

  // Validate if 'Enter Course Title' placeholder is visible after redirection
  const courseTitlePlaceholder = page.locator("input[placeholder='Enter Course Title']");
  await expect(courseTitlePlaceholder).toBeVisible();


  // Click on the 'Enter Course Title' placeholder and input the course title
  await courseTitlePlaceholder.click();
  await courseTitlePlaceholder.fill('chapter drag and drop test');

  // Validate if the course title is successfully entered
  const enteredTitle = await courseTitlePlaceholder.inputValue();
  expect(enteredTitle).toBe('chapter drag and drop test');
  
 await page.waitForTimeout(3000);

   //chapter 1 addition
  // Find the 'Enter chapter name' placeholder text and click on it
  const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
  await page.waitForTimeout(3000);
  await chapterNamePlaceholder.click();

  // Input 'Chapter 1' into the 'Enter chapter name' field
  await chapterNamePlaceholder.fill('Chapter 1');
  await page.waitForTimeout(3000);
  
  // Validate if the chapter name has been successfully added to the field
  const enteredChapterName = await chapterNamePlaceholder.inputValue();
  expect(enteredChapterName).toBe('Chapter 1');
  await page.waitForTimeout(3000);

  // Click on "Add Chapter" button from the left side bar
  const addChapterButton = page.locator("//button[normalize-space()='Add Chapter']");
  await addChapterButton.click();

  await page.waitForTimeout(3000);
  
  // chapter 2 addition
  const chapter2 = page.getByRole('textbox', { name: 'Enter chapter name' });
  await page.waitForTimeout(3000);
  await chapter2.click();
  await page.waitForTimeout(3000);
  await chapter2.fill('Chapter 2');
  await page.waitForTimeout(3000);
  
  // Validate if the chapter 2 name has been successfully added to the field
  const enteredChapterName2 = await chapter2.inputValue();
  expect(enteredChapterName2).toBe('Chapter 2');
  await page.waitForTimeout(3000);

  // Store both chapter positions from the left sidebar before drag and drop
  const chapter1Element = page.locator("//*[contains(text(), 'Chapter 1')]").first();
  await page.waitForTimeout(3000);
  const chapter2Element = page.locator("//*[contains(text(), 'Chapter 2')]").first();
  await page.waitForTimeout(3000);
  
  // Wait for both chapters to be visible in the sidebar
  await expect(chapter1Element).toBeVisible();
  await page.waitForTimeout(3000);
  await expect(chapter2Element).toBeVisible();
  await page.waitForTimeout(3000);
  
  // Get initial positions/order of chapters
  const initialChapter1Position = await chapter1Element.boundingBox();
  await page.waitForTimeout(3000);
  const initialChapter2Position = await chapter2Element.boundingBox();
  await page.waitForTimeout(3000);
  
  console.log('Initial Chapter 1 position:', initialChapter1Position);
  console.log('Initial Chapter 2 position:', initialChapter2Position);
  
  // Validate initial order (Chapter 1 should be above Chapter 2)
  await page.waitForTimeout(3000);
  expect(initialChapter1Position.y).toBeLessThan(initialChapter2Position.y);
  
  // Perform drag and drop: Move Chapter 2 to first position (above Chapter 1)
  await page.waitForTimeout(5000);
  
  // Drag Chapter 2 to the position of Chapter 1
  await chapter2Element.dragTo(chapter1Element);
  await page.waitForTimeout(3000);
  
  // Validate the drag and drop operation by checking new positions
  const finalChapter1Position = await chapter1Element.boundingBox();
  await page.waitForTimeout(3000);
  const finalChapter2Position = await chapter2Element.boundingBox();
  await page.waitForTimeout(3000);
  
  console.log('Final Chapter 1 position:', finalChapter1Position);
  console.log('Final Chapter 2 position:', finalChapter2Position);
  
  // Validate that positions have swapped (Chapter 2 should now be above Chapter 1)
  await page.waitForTimeout(3000);
  expect(finalChapter2Position.y).toBeLessThan(finalChapter1Position.y);
  await page.waitForTimeout(3000);
  
  // Additional validation: Check the order in the DOM
  // Use more specific locators to target only chapter items, not the "Add Chapter" button
  const chaptersAfterDrop = page.locator("//*[text()='Chapter 1' or text()='Chapter 2']");
  await page.waitForTimeout(3000);
  const firstChapterText = await chaptersAfterDrop.first().textContent();
  await page.waitForTimeout(3000);
  const lastChapterText = await chaptersAfterDrop.last().textContent();
  await page.waitForTimeout(3000);
  
  // Validate that Chapter 2 is now first and Chapter 1 is last
  expect(firstChapterText).toContain('Chapter 2');
  await page.waitForTimeout(3000);
  expect(lastChapterText).toContain('Chapter 1');
  
  console.log('Chapter drag and drop validation successful: Chapter 2 is now first, Chapter 1 is last');
  
  // Click on the 3 dots menu beside the Next button
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
  console.log('Reloading the page to validate chapter positions persistence...');
  await page.reload();
  await page.waitForTimeout(5000);

  // Wait for the page to fully load after reload
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Re-locate the chapter elements after page reload
  const reloadedChapter1Element = page.locator("//*[contains(text(), 'Chapter 1')]").first();
  await page.waitForTimeout(3000);
  const reloadedChapter2Element = page.locator("//*[contains(text(), 'Chapter 2')]").first();
  await page.waitForTimeout(3000);

  // Wait for both chapters to be visible after reload
  await expect(reloadedChapter1Element).toBeVisible();
  await page.waitForTimeout(3000);
  await expect(reloadedChapter2Element).toBeVisible();
  await page.waitForTimeout(3000);

  // Get positions after page reload
  const reloadedChapter1Position = await reloadedChapter1Element.boundingBox();
  await page.waitForTimeout(3000);
  const reloadedChapter2Position = await reloadedChapter2Element.boundingBox();
  await page.waitForTimeout(3000);

  console.log('After reload - Chapter 1 position:', reloadedChapter1Position);
  console.log('After reload - Chapter 2 position:', reloadedChapter2Position);

  // Validate that the dragged order is maintained after reload
  // Chapter 2 should still be above Chapter 1
  expect(reloadedChapter2Position.y).toBeLessThan(reloadedChapter1Position.y);

  // Additional validation: Check the DOM order after reload
  const chaptersAfterReload = page.locator("//*[text()='Chapter 1' or text()='Chapter 2']");
  await page.waitForTimeout(3000);
  const firstChapterAfterReload = await chaptersAfterReload.first().textContent();
  await page.waitForTimeout(3000);
  const lastChapterAfterReload = await chaptersAfterReload.last().textContent();
  await page.waitForTimeout(3000);

  // Validate that Chapter 2 is still first and Chapter 1 is still last after reload
  expect(firstChapterAfterReload).toContain('Chapter 2');
  expect(lastChapterAfterReload).toContain('Chapter 1');

  console.log('✅ SUCCESS: Chapter positions are persistent after page reload!');
  console.log('✅ Chapter 2 remains first, Chapter 1 remains last');

  
});
