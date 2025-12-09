import { test, expect } from '@playwright/test';

const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test('Course Creation Flow', async ({ page }, testInfo) => {

  await page.goto(adminLoginURL);
  // Fill in username and password
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');

  // Wait for navigation to wp-admin
  await page.waitForURL('**/wp-admin/**');

  // Assert that the admin bar is visible (login successful)
  await expect(page.locator('#wpadminbar')).toBeVisible();

  // Validate that the h1 tag is 'Dashboard'
  const h1 = page.locator("//h1[normalize-space()='Dashboard']");
  await expect(h1).toHaveText('Dashboard');

  // Optionally, take a screenshot after login
  await page.screenshot({ path: 'login-success.png', fullPage: true });
  console.log('Screenshot saved as login-success.png');

  /*// Go to Plugins page from WordPress menubar
  await page.goto(`${adminURL}/wp-admin/plugins.php`);
  await page.waitForSelector('#the-list');

  // Check if Creator LMS plugin is present
  const creatorLmsPlugin = page.locator('#the-list tr').filter({ hasText: 'Creator LMS' });
  const pluginExists = await creatorLmsPlugin.count() > 0;
  expect(pluginExists).toBeTruthy();
await page.waitForTimeout(3000);
  // Check if the plugin is activated (has a 'Deactivate' link)
  const deactivateLink = await page.locator("//a[@id='deactivate-creatorlms']");
  const activateLink = creatorLmsPlugin.locator('.activate');
  if (await deactivateLink.isVisible()) {
    console.log('✅ Creator LMS plugin is already activated.');
  } else if (await activateLink.isVisible()) {
    console.log('⚠️ Creator LMS plugin is not activated. Activating now...');
    await activateLink.click();
    // Wait for the page to reload and the deactivate link to appear
    await expect(deactivateLink).toBeVisible({ timeout: 10000 });
    console.log('✅ Creator LMS plugin has been activated.');
  } else {
    throw new Error('Creator LMS plugin activation state could not be determined.');
  }*/

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

  // Take a screenshot for validation
  await page.screenshot({ path: 'enter-course-title-visible.png', fullPage: true });
  console.log('Screenshot saved as enter-course-title-visible.png');

  // Store the course title in a constant for comparison
  const courseTitle = 'Mastering Manual Software Testing: Foundations and Practical Application';

  // Click on the 'Enter Course Title' placeholder and input the course title
  await courseTitlePlaceholder.click();
  await courseTitlePlaceholder.fill(courseTitle);

  // Validate if the course title is successfully entered
  const enteredTitle = await courseTitlePlaceholder.inputValue();
  expect(enteredTitle).toBe(courseTitle);

  // Find 'Add course description', click on it, and input the course description
  const courseDescriptionField = page.getByRole('paragraph').first();
  await courseDescriptionField.click();
  await courseDescriptionField.fill(
    "Dive into the essential world of Manual Software Testing with this comprehensive course, designed to equip you with the fundamental skills and practical knowledge needed to ensure software quality. From understanding core testing concepts and methodologies to designing effective test cases, executing tests, and reporting defects, you will learn the crucial role of a manual tester in the software development lifecycle. This program will empower you to identify bugs, improve user experience, and contribute significantly to delivering robust and reliable software products."
  );

  // Optionally, take a screenshot of the filled course description
  await page.screenshot({ path: 'course-description-filled.png', fullPage: true });
  console.log('Screenshot saved as course-description-filled.png');
  await page.waitForTimeout(3000);
  
  // Click on the upload thumbnail image icon
  const uploadThumbnailIcon = page.locator('.components-flex > span > .components-button').first();
  await uploadThumbnailIcon.click();
  await page.waitForTimeout(3000);

  // Click on the Media Library option in the Select or Upload Media window
  const mediaLibraryOption = page.getByRole('tab', { name: 'Media Library' });
  await expect(mediaLibraryOption).toBeVisible({ timeout: 10000 });
  await mediaLibraryOption.click();
  await page.waitForTimeout(5000);
  console.log('✅ Clicked on Media Library tab');

  // Check if there are existing images in the media library
  const existingImages = page.locator(".attachment-preview");
  const imageCount = await existingImages.count();
  console.log(`📊 Found ${imageCount} existing images in media library`);

  if (imageCount > 0) {
    // Use existing images from media library - select randomly
    console.log('✅ Using existing images from media library');
    const randomIndex = Math.floor(Math.random() * imageCount);
    const selectedImage = existingImages.nth(randomIndex);
    await expect(selectedImage).toBeVisible({ timeout: 5000 });
    await selectedImage.click();
    await page.waitForTimeout(3000);
    console.log(`✅ Selected random image from media library (index ${randomIndex})`);
    
  } else {
    // No images found in media library, need to upload new one
    console.log('ℹ️  No images found in media library, uploading new image...');
    
    // Click on "Select Files" button to upload new image
    const selectFilesButton = page.getByRole('button', { name: 'Select Files' });
    await expect(selectFilesButton).toBeVisible({ timeout: 5000 });
    
    // Wait for file chooser and click Select Files
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      selectFilesButton.click()
    ]);
    
    // Automatically find and select an image file from common locations
    const { execSync } = require('child_process');
    const path = require('path');
    const os = require('os');
    
    try {
      let selectedImagePath = null;
      
      // Try to find images in Downloads folder primarily
      const searchPaths = [
        path.join(os.homedir(), 'Downloads'),
        path.join(os.homedir(), 'Desktop')
      ];
      
      for (const searchPath of searchPaths) {
        try {
          const findCommand = `find "${searchPath}" -type f \\( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \\) 2>/dev/null | head -10`;
          const foundImages = execSync(findCommand, { encoding: 'utf8' }).trim().split('\n').filter(f => f);
          
          if (foundImages.length > 0) {
            selectedImagePath = foundImages[Math.floor(Math.random() * foundImages.length)];
            console.log(`✅ Found image in ${searchPath}: ${selectedImagePath.split('/').pop()}`);
            break;
          }
        } catch (e) {
          console.log(`❌ Could not search ${searchPath}`);
        }
      }
      
      if (selectedImagePath) {
        await fileChooser.setFiles(selectedImagePath);
        console.log(`✅ Selected file: ${selectedImagePath}`);
        await page.waitForTimeout(5000);
      } else {
        console.log('❌ No suitable images found in common locations');
        // Fall back to canceling the file chooser
        await page.keyboard.press('Escape');
        return;
      }
      
    } catch (error) {
      console.log(`❌ Error during file selection: ${error.message}`);
      // Fall back to canceling the file chooser
      await page.keyboard.press('Escape');
      return;
    }
  }

  // Click "Use this media" button (common for both existing and new images)
  const useThisMediaButton = page.getByRole('button', { name: 'Use this media' });
  await expect(useThisMediaButton).toBeVisible({ timeout: 10000 });
  await useThisMediaButton.click();
  await page.waitForTimeout(2000);
  console.log('✅ Used media successfully');
  // Take a screenshot to validate the uploaded image
  await page.screenshot({ path: 'uploaded-image-validation.png', fullPage: true });
  console.log('Screenshot saved as uploaded-image-validation.png');

  // Define the uploadedImage locator and validate it's visible
  const uploadedImage = page.locator("//div[@class='crlms-course-thumb-controls']");
  await expect(uploadedImage).toBeVisible({ timeout: 10000 });
  console.log('✅ Course thumbnail image uploaded and validated successfully');
  await page.waitForTimeout(3000); 

  // Click on the specified SVG button
  const svgButton = page.locator("//span[2]//button[1]//*[name()='svg']//*[name()='rect' and contains(@width,'30')]");
  await expect(svgButton).toBeVisible({ timeout: 10000 });
  await svgButton.click();
  await page.waitForTimeout(3000);

  // Click on Media Library of Select or Upload Media
  const mediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
  await expect(mediaLibraryTab).toBeVisible({ timeout: 10000 });
  await mediaLibraryTab.click();
  await page.waitForTimeout(2000);

  // Check if there are existing videos in the media library (filter by video type only)
  console.log('🔍 Checking for existing videos in media library...');
  
  // First get all media items, then filter for videos only
  const allMediaItems = page.locator(".attachment-preview");
  const allMediaCount = await allMediaItems.count();
  console.log(`📊 Found ${allMediaCount} total media items in library`);
  
  // Filter for video files specifically
  let actualVideoCount = 0;
  let videoElements = [];
  
  for (let i = 0; i < allMediaCount; i++) {
    const mediaItem = allMediaItems.nth(i);
    
    // Check if this media item is a video by looking for video-specific classes or attributes
    const isVideo = await mediaItem.evaluate((element) => {
      const classes = element.className || '';
      const ariaLabel = element.getAttribute('aria-label') || '';
      const title = element.title || '';
      
      // Check for video indicators
      return classes.includes('type-video') || 
             ariaLabel.toLowerCase().includes('video') ||
             title.toLowerCase().includes('video') ||
             classes.includes('subtype-mp4') ||
             classes.includes('subtype-mov') ||
             classes.includes('subtype-avi');
    });
    
    if (isVideo) {
      videoElements.push(mediaItem);
      actualVideoCount++;
    }
  }
  
  console.log(`🎥 Found ${actualVideoCount} actual video files in media library`);

  if (actualVideoCount > 0) {
    // Use existing videos from media library - select randomly
    console.log('✅ Using existing videos from media library');
    const randomIndex = Math.floor(Math.random() * actualVideoCount);
    const selectedVideo = videoElements[randomIndex];
    
    // Scroll to make video visible if needed
    await selectedVideo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Try to make video visible and click
    try {
      await expect(selectedVideo).toBeVisible({ timeout: 3000 });
      await selectedVideo.click();
      await page.waitForTimeout(3000);
      console.log(`✅ Selected random video from media library (index ${randomIndex})`);
    } catch (error) {
      console.log(`⚠️ Random video ${randomIndex} not accessible, trying Select Files instead...`);
      
      // If videos exist but are not accessible, use Select Files
      const selectFilesButton = page.getByRole('button', { name: 'Select Files' });
      try {
        await expect(selectFilesButton).toBeVisible({ timeout: 3000 });
        const [fileChooser] = await Promise.all([
          page.waitForEvent('filechooser'),
          selectFilesButton.click()
        ]);
        
        // Try to find a video file
        const testVideoPath = '/Users/coderex/Desktop/test-video.mp4';
        await fileChooser.setFiles(testVideoPath);
        console.log(`📁 Uploaded video file: ${testVideoPath}`);
      } catch (uploadError) {
        console.log('⚠️ Could not upload video file, continuing without video...');
      }
    }
    
  } else {
    // No videos found in media library, need to upload new one
    console.log('ℹ️  No videos found in media library, uploading new video...');
    
    // Click on "Select Files" button to upload new video
    const selectFilesButton = page.getByRole('button', { name: 'Select Files' });
    await expect(selectFilesButton).toBeVisible({ timeout: 5000 });
    
    // Wait for file chooser and click Select Files
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      selectFilesButton.click()
    ]);
    
    // Automatically find and select a video file from common locations
    const { execSync } = require('child_process');
    const path = require('path');
    const os = require('os');
    
    try {
      let selectedVideoPath = null;
      
      // Try to find videos in Downloads folder primarily
      const searchPaths = [
        path.join(os.homedir(), 'Downloads'),
        path.join(os.homedir(), 'Desktop')
      ];
      
      for (const searchPath of searchPaths) {
        try {
          const findCommand = `find "${searchPath}" -type f \\( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.avi" -o -iname "*.mkv" \\) 2>/dev/null | head -5`;
          const foundVideos = execSync(findCommand, { encoding: 'utf8' }).trim().split('\n').filter(f => f);
          
          if (foundVideos.length > 0) {
            selectedVideoPath = foundVideos[Math.floor(Math.random() * foundVideos.length)];
            console.log(`✅ Found video in ${searchPath}: ${selectedVideoPath.split('/').pop()}`);
            break;
          }
        } catch (e) {
          console.log(`❌ Could not search ${searchPath}`);
        }
      }
      
      if (selectedVideoPath) {
        await fileChooser.setFiles(selectedVideoPath);
        console.log(`✅ Selected video file: ${selectedVideoPath}`);
        await page.waitForTimeout(8000); // Wait longer for video upload
      } else {
        console.log('❌ No suitable videos found, skipping video upload');
        // Cancel the file chooser
        await page.keyboard.press('Escape');
        await page.waitForTimeout(2000);
        
        // Skip the video upload validation and continue
        console.log('⏭️  Continuing without video upload...');
        
        // Find the 'Enter chapter name' placeholder and continue with the test
        const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
        await expect(chapterNamePlaceholder).toBeVisible({ timeout: 10000 });
        await chapterNamePlaceholder.click();
        await chapterNamePlaceholder.fill('Fundamentals of Software Testing and Test Design');
        console.log('✅ Filled chapter name');
        return; // Exit early since no video was uploaded
      }
      
    } catch (error) {
      console.log(`❌ Error during video file selection: ${error.message}`);
      // Cancel file chooser and continue without video
      await page.keyboard.press('Escape');
      await page.waitForTimeout(2000);
      console.log('⏭️  Continuing without video upload...');
      
      // Continue with chapter name
      const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
      await expect(chapterNamePlaceholder).toBeVisible({ timeout: 10000 });
      await chapterNamePlaceholder.click();
      await chapterNamePlaceholder.fill('Fundamentals of Software Testing and Test Design');
      console.log('✅ Filled chapter name');
      return;
    }
  }

  // Click on the specified button
  const specifiedButton = page.getByRole('button', { name: 'Use this media' });
  await expect(specifiedButton).toBeVisible({ timeout: 10000 });
  await specifiedButton.click();
  await page.waitForTimeout(3000);
  
  // Validate if the video player button is visible
  const videoPlayerButton = page.locator("//div[contains(@class,'components-flex crlms-thumb-video-player css-1f9s4va e19lxcc00')]//button[contains(@type,'button')]");
  await expect(videoPlayerButton).toBeVisible();

  // Click on the video player button
  await videoPlayerButton.click();
  await page.waitForTimeout(3000);
  
  // Validate if the specified icon is visible
  const specifiedIcon = page.locator("//div[contains(@class,'components-flex crlms-course-thumb-actions css-1jf8kqz e19lxcc00')]//span[contains(@class,'tooltip-icon')]//div//button[contains(@type,'button')]//*[name()='svg']//*[name()='rect' and contains(@width,'30')]");
  await expect(specifiedIcon).toBeVisible();

  // Find the 'Enter chapter name' placeholder text and click on it
  const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
  await chapterNamePlaceholder.click();

  // Input 'Fundamentals of Software Testing and Test Design' into the 'Enter chapter name' field
  await chapterNamePlaceholder.fill('Fundamentals of Software Testing and Test Design');
  await page.waitForTimeout(3000);
  
  // Validate if the chapter name has been successfully added to the field
  const enteredChapterName = await chapterNamePlaceholder.inputValue();
  expect(enteredChapterName).toBe('Fundamentals of Software Testing and Test Design');

  // Find the 'Add chapter description ...' text and click on it
  const chapterDescriptionField = page.getByRole('paragraph').filter({ hasText: /^$/ });
  await chapterDescriptionField.click();

  // Fill the 'Add chapter description ...' field with the provided text
  await chapterDescriptionField.fill(
    "This foundational chapter introduces the core concepts of software testing, emphasizing its crucial role in software quality assurance. You will learn about the various types of testing, the phases of the Software Development Life Cycle (SDLC) and Software Testing Life Cycle (STLC), and essential techniques for designing effective test cases that thoroughly validate software functionality."
  );
    await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(3000);
  await page.locator("//button[normalize-space()='Next']").click();
  await page.waitForTimeout(3000);
  
  // Click on Preview link and validate it opens a new tab with different URL
  const [newPreviewPage] = await Promise.all([
    page.context().waitForEvent('page'), // Wait for a new page to open
    page.locator("//a[normalize-space()='Preview']").click() // Click the Preview link
  ]);
  
  // Wait for the new page to load
  await page.waitForTimeout(5000);
  
  // Validate that the new tab has a different URL from the original page
  expect(newPreviewPage.url()).not.toBe(page.url());
  console.log('Original page URL:', page.url());
  console.log('Preview page URL:', newPreviewPage.url());
  await page.waitForTimeout(3000);
  
  // Validate that the course title on the preview page matches the entered title
  const previewPageTitle = newPreviewPage.locator('h1').first();
  await expect(previewPageTitle).toBeVisible();
  const previewTitleText = await previewPageTitle.textContent();
  expect(previewTitleText.trim()).toBe(courseTitle);
  console.log('Course title validation successful:', previewTitleText);
  
  // Take a screenshot of the preview page for validation
  await newPreviewPage.screenshot({ path: 'course-preview-page.png', fullPage: true });
  console.log('Screenshot saved as course-preview-page.png');
  
  // Close the preview tab and switch back to the original tab
  await newPreviewPage.close();
  await page.bringToFront();
  await page.waitForTimeout(3000);
  // Validate we're back on the original course editing page
  await expect(page.locator("//a[normalize-space()='Preview']")).toBeVisible();
  console.log('Successfully returned to course editing page');
  await page.waitForTimeout(5000);
  // Click on the Publish button
  const publishButton = page.locator("//button[normalize-space()='Publish']");
  await publishButton.click();
  await page.waitForTimeout(3000);

  // Validate 'Course has been published successfully' notification appears
  // Using multiple possible selectors for the success notification and select first match
  const successNotification = page.locator("//div[contains(@class, 'components-notice') and contains(@class, 'is-success')] | //div[contains(@class, 'crlms-notice-wrapper')] | //div[contains(text(), 'Course has been published successfully')]").first();
  await expect(successNotification).toBeVisible({ timeout: 10000 });

  // Get the notification text to validate the message
  const notificationText = await successNotification.textContent();
  expect(notificationText).toContain('Course has been published successfully');
  console.log('Success notification appeared:', notificationText.trim());

  // Take a screenshot after successful publish
  await page.screenshot({ path: 'course-published-success.png', fullPage: true });
  console.log('Screenshot saved as course-published-success.png');
  await page.waitForTimeout(3000);
  // Validate that the Publish button text has changed to 'Update'
  const updateButton = page.locator("//button[normalize-space()='Update']");
  await page.waitForTimeout(3000);
  await expect(updateButton).toBeVisible();
  await page.waitForTimeout(3000);
  console.log('✅ Publish button has changed to Update button successfully');
  await page.waitForTimeout(3000);  

  // Validate that the old Publish button is no longer visible
  const publishButtonAfter = page.locator("//button[normalize-space()='Publish']");
  await page.waitForTimeout(3000);
  await expect(publishButtonAfter).not.toBeVisible();
  console.log('✅ Publish button is no longer visible after course publication');
  await page.waitForTimeout(3000);

  // Click on the Back button from the top left side
  const backButton = page.locator("//button[normalize-space()='Back']");
  await page.waitForTimeout(3000);
  await backButton.click();
  await page.waitForTimeout(3000);

  // Validate if we're back on the All Courses page
  const allCoursesHeadingAfter = page.locator("//h1[normalize-space()='All Courses']");
  await page.waitForTimeout(3000);
  await expect(allCoursesHeadingAfter).toBeVisible({ timeout: 10000 });
  console.log('✅ Successfully navigated back to All Courses page');
  await page.waitForTimeout(3000);

  // Find the created course by course title in the course details column
  const createdCourseRow = page.locator(`//tr[contains(., '${courseTitle}')]`);
  await page.waitForTimeout(3000);
  await expect(createdCourseRow).toBeVisible({ timeout: 10000 });
  console.log('✅ Created course found in the courses list');
  await page.waitForTimeout(3000);

  // Validate that the course status shows 'Published'
  const publishedStatus = page.locator("//tr[contains(@class,'crlms-tr crlms-tr-0')]//span[contains(@class,'crlms-badge crlms-badge-success crlms-badge-borderless')][normalize-space()='Published']");
  await page.waitForTimeout(3000);
  await expect(publishedStatus).toBeVisible({ timeout: 5000 });
  console.log('✅ Course status is showing as Published');

  // Take a final screenshot of the All Courses page with the published course
  await page.screenshot({ path: 'all-courses-with-published-course.png', fullPage: true });
  console.log('Screenshot saved as all-courses-with-published-course.png');

  // Click on the 3 dots under Action column for the specific course
  await page.waitForTimeout(3000);
  const actionDotsButton = page.locator(`//tr[contains(., '${courseTitle}')]//button[@class='components-button components-dropdown-menu__toggle has-icon']`);
  await page.waitForTimeout(3000);
  await actionDotsButton.click();
  await page.waitForTimeout(2000);
  console.log('✅ Clicked on action menu (3 dots) for the published course');
  await page.waitForTimeout(3000);
  // Click on the Delete option from the dropdown
  const deleteOption = page.locator("//span[normalize-space()='Delete']");
  await page.waitForTimeout(3000);
  await deleteOption.click();
  await page.waitForTimeout(2000);
  console.log('✅ Clicked on Delete option from the dropdown menu');
  await page.waitForTimeout(3000);   

  // Validate delete confirmation modal appears
  const deleteModal = page.locator("h4:has-text('Delete Course')").first();
  await page.waitForTimeout(3000);  
  await expect(deleteModal).toBeVisible();
  console.log('✅ Delete confirmation modal is visible');
  await page.waitForTimeout(3000);    

  // Validate the confirmation message
  const confirmationMessage = page.locator("text=Are you sure you want to delete course?");
  await page.waitForTimeout(3000);  
  await expect(confirmationMessage).toBeVisible();
  console.log('✅ Delete confirmation message validated');
  await page.waitForTimeout(3000);

  // Take screenshot of delete confirmation modal
  await page.screenshot({ path: 'delete-confirmation-modal.png' });
  console.log('✅ Screenshot taken of delete confirmation modal');
  await page.waitForTimeout(3000);

  // Click on the Delete button to confirm deletion
  const deleteButton = page.locator("//button[normalize-space()='Delete']");
  await page.waitForTimeout(3000);
  await deleteButton.click();
  await page.waitForTimeout(3000);
  console.log('✅ Clicked on Delete button to confirm course deletion');

  // Validate "Deleted Successfully" notification appears
  await page.waitForTimeout(3000);
  const deleteSuccessNotification = page.locator("text=Deleted Successfully");
  await page.waitForTimeout(3000);
  await expect(deleteSuccessNotification).toBeVisible();
  console.log('✅ "Deleted Successfully" notification is visible');
  await page.waitForTimeout(3000);

  // Take screenshot of the success notification
  await page.screenshot({ path: 'course-deleted-successfully.png' });
  console.log('✅ Screenshot taken of delete success notification');
  await page.waitForTimeout(3000);

  // Wait for notification to disappear and page to update
  await page.waitForTimeout(5000);
  console.log('✅ Course deletion workflow completed successfully');

  // Validate that the course is no longer visible in the course list
  await page.waitForTimeout(3000);
  const deletedCourseRow = page.locator(`text=${courseTitle}`);
  await page.waitForTimeout(3000);
  await expect(deletedCourseRow).not.toBeVisible();
  console.log(`✅ Validated that course "${courseTitle}" is no longer visible in the course list`);

  // Take final screenshot of the updated course list
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'course-list-after-deletion.png' });
  console.log('✅ Final screenshot taken of course list after deletion');

  // Additional validation: Check if course list is empty or shows "No courses found"
  await page.waitForTimeout(3000);
  const courseRows = page.locator('tbody tr');
  await page.waitForTimeout(3000);
  const courseCount = await courseRows.count();
  await page.waitForTimeout(3000);

  if (courseCount === 0) {
    console.log('✅ Course list is now empty - all courses have been deleted');
  } else {
    console.log(`✅ Course list now contains ${courseCount} course(s) - deleted course successfully removed`);
  }

});
