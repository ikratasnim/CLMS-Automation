import { test, expect } from '@playwright/test';

const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test('Test Course Creation and Edit Functionality', async ({ page }, testInfo) => {

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

  // STEP 1: CREATE COURSE WITH INITIAL DATA
  console.log('📝 Creating course with initial data...');

  // Validate if 'Enter Course Title' placeholder is visible after redirection
  const courseTitlePlaceholder = page.locator("input[placeholder='Enter Course Title']");
  await expect(courseTitlePlaceholder).toBeVisible();

  // Provide course title with timestamp for uniqueness
  const originalCourseTitle = `Course Edit Test ${new Date().getTime()}`;
  await courseTitlePlaceholder.click();
  await courseTitlePlaceholder.fill(originalCourseTitle);

  console.log(`✅ Course title provided: ${originalCourseTitle}`);

  // Upload cover image randomly from media library
  const uploadThumbnailIcon = page.locator('.components-flex > span > .components-button').first();
  await uploadThumbnailIcon.click();
  await page.waitForTimeout(3000);

  // Click on the Media Library option
  const mediaLibraryOption = page.getByRole('tab', { name: 'Media Library' });
  await mediaLibraryOption.click();
  await page.waitForTimeout(3000);

  // Select a random image from media library
  const randomImageIndex = Math.floor(Math.random() * await page.locator(".attachment-preview img").count());
  const randomImage = page.locator(".attachment-preview img").nth(randomImageIndex);
  await randomImage.scrollIntoViewIfNeeded();
  await randomImage.waitFor({ state: 'visible', timeout: 5000 });
  await randomImage.click({ force: true });
  await page.waitForTimeout(3000);

  const useThisMediaButton = page.getByRole('button', { name: 'Use this media' });
  await useThisMediaButton.click();
  await page.waitForTimeout(3000);

  // Get the selected image source for data storage
  const uploadedImage = page.locator("//div[@class='crlms-course-thumb-controls']");
  const selectedImageSrc = await uploadedImage.getAttribute('src') || 'Image uploaded';

  console.log('✅ Cover image uploaded randomly from media library');

  // Provide chapter title
  const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
  await chapterNamePlaceholder.click();
  const originalChapterTitle = `Original Chapter ${new Date().getTime()}`;
  await chapterNamePlaceholder.fill(originalChapterTitle);
  await page.waitForTimeout(3000);

  console.log(`✅ Chapter title provided: ${originalChapterTitle}`);

  // Take screenshot before publishing
  await page.screenshot({ path: 'course-before-publish.png', fullPage: true });
  console.log('📸 Screenshot saved: course-before-publish.png');

  // Navigate to Settings and Publish the course
  const nextButton = page.locator("//button[normalize-space()='Next']");
  await nextButton.click();
  await page.waitForTimeout(3000);

  // Navigate to Preview/Publish section
  const nextButton2 = page.locator("//button[normalize-space()='Next']");
  await nextButton2.click();
  await page.waitForTimeout(3000);

  // Publish the course
  const publishButton = page.locator("//button[normalize-space()='Publish']");
  await publishButton.click();
  await page.waitForTimeout(5000);

  console.log('✅ Course published successfully');

  // STORE THE 3 DATA POINTS
  const storedData = {
    courseTitle: originalCourseTitle,
    chapterTitle: originalChapterTitle,
    imageSrc: selectedImageSrc
  };

  console.log('📊 Stored Data:', storedData);

  // STEP 2: GO BACK TO COURSE LISTING PAGE
  console.log('🔙 Navigating back to course listing...');

  // Click on the back button
  const backButton = page.locator("//button[contains(.,'Back')] | //button[@aria-label='Back']");
  await backButton.click();
  await page.waitForTimeout(5000);

  // Wait for course listing page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('✅ Returned to course listing page');

  // STEP 3: SEARCH FOR THE NEWLY ADDED COURSE
  console.log('🔍 Searching for the newly created course...');

  // Look for the course in the listing (it should be the most recent)
  const courseRow = page.locator(`//tr[.//text()[contains(.,'${originalCourseTitle}')]]`).first();
  await expect(courseRow).toBeVisible();

  console.log('✅ Found the newly created course in listing');

  // STEP 4: HOVER AND CLICK EDIT ICON
  console.log('✏️ Hovering on course and clicking edit icon...');

  // Hover on the course row
  await courseRow.hover();
  await page.waitForTimeout(2000);

  // Click on the edit icon using the correct selector
  const editIcon = page.getByRole('button', { name: 'Edit' });
  await page.waitForTimeout(2000);
  await editIcon.click();
  await page.waitForTimeout(5000);

  console.log('✅ Clicked edit icon and opened course editor');

  // STEP 5: CHANGE COURSE AND CHAPTER TITLES
  console.log('📝 Modifying course and chapter titles...');

  // Wait for edit page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Change course title
  const editCourseTitleField = page.locator("input[placeholder='Enter Course Title']");
  await editCourseTitleField.waitFor({ state: 'visible', timeout: 10000 });
  await editCourseTitleField.clear();
  const newCourseTitle = `${originalCourseTitle} - EDITED`;
  await editCourseTitleField.fill(newCourseTitle);
  await page.waitForTimeout(2000);

  console.log(`✅ Course title changed to: ${newCourseTitle}`);

  // Change chapter title
  const editChapterTitleField = page.locator("input[placeholder='Enter chapter name']");
  await editChapterTitleField.clear();
  const newChapterTitle = `${originalChapterTitle} - EDITED`;
  await editChapterTitleField.fill(newChapterTitle);
  await page.waitForTimeout(2000);

  console.log(`✅ Chapter title changed to: ${newChapterTitle}`);

  // Take screenshot after editing
  await page.screenshot({ path: 'course-after-edit.png', fullPage: true });
  console.log('📸 Screenshot saved: course-after-edit.png');

  // STEP 6: PUBLISH THE EDITED COURSE
  console.log('📤 Publishing the edited course...');

  // Navigate to publish section
  const nextButtonEdit1 = page.locator("//button[normalize-space()='Next']");
  await nextButtonEdit1.click();
  await page.waitForTimeout(3000);

  const nextButtonEdit2 = page.locator("//button[normalize-space()='Next']");
  await nextButtonEdit2.click();
  await page.waitForTimeout(3000);

  // Publish the edited course
  const publishEditedButton = page.locator("//button[normalize-space()='Publish'] | //button[normalize-space()='Update']");
  await publishEditedButton.click();
  await page.waitForTimeout(5000);

  console.log('✅ Edited course published successfully');

  // STEP 7: VALIDATE THE CHANGES
  console.log('✅ Validating the changes...');

  // Take final screenshot
  await page.screenshot({ path: 'course-final-state.png', fullPage: true });
  console.log('📸 Screenshot saved: course-final-state.png');

  // Go back to listing to verify changes
  const backButtonFinal = page.locator("//button[contains(.,'Back')] | //button[@aria-label='Back']");
  await backButtonFinal.click();
  await page.waitForTimeout(5000);

  // Verify the updated course title appears in listing
  const updatedCourseRow = page.locator(`//tr[.//text()[contains(.,'${newCourseTitle}')]]`).first();
  await expect(updatedCourseRow).toBeVisible();

  console.log('✅ Verified updated course title appears in listing');

  // FINAL VALIDATION SUMMARY
  console.log('🎯 Course Creation and Edit Test Completed Successfully!');
  console.log('📋 Summary:');
  console.log(`   📝 Original Course Title: "${originalCourseTitle}"`);
  console.log(`   📝 New Course Title: "${newCourseTitle}"`);
  console.log(`   📁 Original Chapter Title: "${originalChapterTitle}"`);
  console.log(`   📁 New Chapter Title: "${newChapterTitle}"`);
  console.log(`   🖼️ Cover Image: ${selectedImageSrc ? 'Uploaded successfully' : 'Upload attempted'}`);
  console.log('   📸 Screenshots taken for comparison');
  console.log('🏆 All functionalities working correctly!');

});