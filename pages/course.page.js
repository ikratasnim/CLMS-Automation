import { expect } from '@playwright/test';
import { getEnv } from '../utils/env.helper.js';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';

const { url } = getEnv();

export class CoursePage {
  constructor(page) {
    this.page = page;
  }

  // Navigation methods
  async navigateToWordPressAdmin() {
    await this.page.goto(`${url}/wp-admin/`);
  }

  async navigateToPlugins() {
    await this.page.goto(`${url}/wp-admin/plugins.php`);
    await this.page.waitForSelector('#the-list');
  }

  async ensureCreatorLMSPluginActivated() {
    const creatorLmsPlugin = this.page.locator('#the-list tr').filter({ hasText: 'Creator LMS' });
    const pluginExists = await creatorLmsPlugin.count() > 0;
    expect(pluginExists).toBeTruthy();
    
    await this.page.waitForTimeout(3000);
    
    const deactivateLink = this.page.locator("//a[@id='deactivate-creatorlms']");
    const activateLink = creatorLmsPlugin.locator('.activate');
    
    if (await deactivateLink.isVisible()) {
      console.log('✅ Creator LMS plugin is already activated.');
    } else if (await activateLink.isVisible()) {
      console.log('⚠️ Creator LMS plugin is not activated. Activating now...');
      await activateLink.click();
      await expect(deactivateLink).toBeVisible({ timeout: 10000 });
      console.log('✅ Creator LMS plugin has been activated.');
    } else {
      throw new Error('Creator LMS plugin activation state could not be determined.');
    }
  }

  async navigateToCreatorLMS() {
    const creatorLmsMenu = this.page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.hover();
    const coursesSubmenu = this.page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.click();
  }

  async navigateToCourses() {
    await this.page.waitForTimeout(3000);
    const allCoursesHeading = this.page.locator("//h1[normalize-space()='All Courses']");
    await expect(allCoursesHeading).toBeVisible();
  }

  async verifyAllCoursesPage() {
    const allCoursesHeading = this.page.locator("//h1[normalize-space()='All Courses']");
    await expect(allCoursesHeading).toBeVisible();
  }

  // Course creation methods
  async clickAddCourse() {
    const addCourseButton = this.page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await addCourseButton.click();
    await this.page.waitForTimeout(3000);
  }

  async startFromScratch() {
    const startFromScratchOption = this.page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await this.page.waitForTimeout(3000);
  }

  async fillCourseTitle(title) {
    const courseTitlePlaceholder = this.page.locator("input[placeholder='Enter Course Title']");
    await expect(courseTitlePlaceholder).toBeVisible();
    await this.page.screenshot({ path: 'enter-course-title-visible.png', fullPage: true });
    console.log('Screenshot saved as enter-course-title-visible.png');
    
    await courseTitlePlaceholder.click();
    await courseTitlePlaceholder.fill(title);
    
    const enteredTitle = await courseTitlePlaceholder.inputValue();
    expect(enteredTitle).toBe(title);
    
    return title;
  }

  async fillCourseDescription(description) {
    const courseDescriptionField = this.page.getByRole('paragraph').first();
    await courseDescriptionField.click();
    await courseDescriptionField.fill(description);
    
    await this.page.screenshot({ path: 'course-description-filled.png', fullPage: true });
    console.log('Screenshot saved as course-description-filled.png');
    await this.page.waitForTimeout(3000);
  }

  // Media upload methods
  async uploadCourseThumbnail() {
    // Click on the upload thumbnail image icon
    const uploadThumbnailIcon = this.page.locator('.components-flex > span > .components-button').first();
    await uploadThumbnailIcon.click();
    await this.page.waitForTimeout(3000);

    // Click on the Media Library option
    const mediaLibraryOption = this.page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryOption).toBeVisible({ timeout: 10000 });
    await mediaLibraryOption.click();
    await this.page.waitForTimeout(5000);
    console.log('✅ Clicked on Media Library tab');

    // Check if there are existing images in the media library
    const existingImages = this.page.locator(".attachment-preview");
    const imageCount = await existingImages.count();
    console.log(`📊 Found ${imageCount} existing images in media library`);

    if (imageCount > 0) {
      // Use existing images from media library - select randomly
      console.log('✅ Using existing images from media library');
      const randomIndex = Math.floor(Math.random() * imageCount);
      const selectedImage = existingImages.nth(randomIndex);
      await expect(selectedImage).toBeVisible({ timeout: 5000 });
      await selectedImage.click();
      await this.page.waitForTimeout(3000);
      console.log(`✅ Selected random image from media library (index ${randomIndex})`);
    } else {
      // No images found, upload new one
      console.log('ℹ️  No images found in media library, uploading new image...');
      
      const selectFilesButton = this.page.getByRole('button', { name: 'Select Files' });
      await expect(selectFilesButton).toBeVisible({ timeout: 5000 });
      
      const [fileChooser] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        selectFilesButton.click()
      ]);
      
      try {
        let selectedImagePath = null;
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
          await this.page.waitForTimeout(5000);
        } else {
          console.log('❌ No suitable images found in common locations');
          await this.page.keyboard.press('Escape');
          return;
        }
      } catch (error) {
        console.log(`❌ Error during file selection: ${error.message}`);
        await this.page.keyboard.press('Escape');
        return;
      }
    }

    // Click "Use this media" button
    const useThisMediaButton = this.page.getByRole('button', { name: 'Use this media' });
    await expect(useThisMediaButton).toBeVisible({ timeout: 10000 });
    await useThisMediaButton.click();
    await this.page.waitForTimeout(2000);
    console.log('✅ Used media successfully');
    
    // Take a screenshot to validate the uploaded image
    await this.page.screenshot({ path: 'uploaded-image-validation.png', fullPage: true });
    console.log('Screenshot saved as uploaded-image-validation.png');

    // Validate uploaded image is visible
    const uploadedImage = this.page.locator("//div[@class='crlms-course-thumb-controls']");
    await expect(uploadedImage).toBeVisible({ timeout: 10000 });
    console.log('✅ Course thumbnail image uploaded and validated successfully');
    await this.page.waitForTimeout(3000);
  }

  async uploadCourseVideo() {
    // Click on the specified SVG button
    const svgButton = this.page.locator("//span[2]//button[1]//*[name()='svg']//*[name()='rect' and contains(@width,'30')]");
    await expect(svgButton).toBeVisible({ timeout: 10000 });
    await svgButton.click();
    await this.page.waitForTimeout(3000);

    // Click on Media Library
    const mediaLibraryTab = this.page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryTab).toBeVisible({ timeout: 10000 });
    await mediaLibraryTab.click();
    await this.page.waitForTimeout(2000);

    // Check for existing videos
    console.log('🔍 Checking for existing videos in media library...');
    
    const allMediaItems = this.page.locator(".attachment-preview");
    const allMediaCount = await allMediaItems.count();
    console.log(`📊 Found ${allMediaCount} total media items in library`);
    
    // Filter for video files
    let actualVideoCount = 0;
    let videoElements = [];
    
    for (let i = 0; i < allMediaCount; i++) {
      const mediaItem = allMediaItems.nth(i);
      const isVideo = await mediaItem.evaluate((element) => {
        const classes = element.className || '';
        const ariaLabel = element.getAttribute('aria-label') || '';
        const title = element.title || '';
        
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
      // Use existing video
      console.log('✅ Using existing videos from media library');
      const randomIndex = Math.floor(Math.random() * actualVideoCount);
      const selectedVideo = videoElements[randomIndex];
      
      await selectedVideo.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000);
      
      try {
        await expect(selectedVideo).toBeVisible({ timeout: 3000 });
        await selectedVideo.click();
        await this.page.waitForTimeout(3000);
        console.log(`✅ Selected random video from media library (index ${randomIndex})`);
      } catch (error) {
        console.log(`⚠️ Random video ${randomIndex} not accessible, trying Select Files instead...`);
        await this.uploadNewVideo();
      }
    } else {
      // No videos found, upload new one
      console.log('ℹ️  No videos found in media library, uploading new video...');
      await this.uploadNewVideo();
    }

    // Click "Use this media" button
    const specifiedButton = this.page.getByRole('button', { name: 'Use this media' });
    await expect(specifiedButton).toBeVisible({ timeout: 10000 });
    await specifiedButton.click();
    await this.page.waitForTimeout(3000);
    
    // Validate video player button is visible
    const videoPlayerButton = this.page.locator("//div[contains(@class,'components-flex crlms-thumb-video-player css-1f9s4va e19lxcc00')]//button[contains(@type,'button')]");
    await expect(videoPlayerButton).toBeVisible();

    // Click on the video player button
    await videoPlayerButton.click();
    await this.page.waitForTimeout(3000);
    
    // Validate icon is visible
    const specifiedIcon = this.page.locator("//div[contains(@class,'components-flex crlms-course-thumb-actions css-1jf8kqz e19lxcc00')]//span[contains(@class,'tooltip-icon')]//div//button[contains(@type,'button')]//*[name()='svg']//*[name()='rect' and contains(@width,'30')]");
    await expect(specifiedIcon).toBeVisible();
  }

  async uploadNewVideo() {
    const selectFilesButton = this.page.getByRole('button', { name: 'Select Files' });
    
    try {
      await expect(selectFilesButton).toBeVisible({ timeout: 5000 });
      
      const [fileChooser] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        selectFilesButton.click()
      ]);
      
      let selectedVideoPath = null;
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
        await this.page.waitForTimeout(8000);
      } else {
        console.log('❌ No suitable videos found, skipping video upload');
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(2000);
        throw new Error('No video found');
      }
    } catch (error) {
      console.log(`❌ Error during video file selection: ${error.message}`);
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(2000);
      throw error;
    }
  }

  // Chapter methods
  async fillChapterName(name) {
    const chapterNamePlaceholder = this.page.locator("input[placeholder='Enter chapter name']");
    await chapterNamePlaceholder.click();
    await chapterNamePlaceholder.fill(name);
    await this.page.waitForTimeout(3000);
    
    const enteredChapterName = await chapterNamePlaceholder.inputValue();
    expect(enteredChapterName).toBe(name);
  }

  async fillChapterDescription(description) {
    const chapterDescriptionField = this.page.getByRole('paragraph').filter({ hasText: /^$/ });
    await chapterDescriptionField.click();
    await chapterDescriptionField.fill(description);
    await this.page.waitForTimeout(3000);
  }

  async clickNextButton() {
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.waitForTimeout(3000);
  }

  async clickNextButtonAgain() {
    await this.page.locator("//button[normalize-space()='Next']").click();
    await this.page.waitForTimeout(3000);
  }

  // Preview methods
  async openPreview() {
    const [newPreviewPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.locator("//a[normalize-space()='Preview']").click()
    ]);
    
    await this.page.waitForTimeout(5000);
    
    return newPreviewPage;
  }

  async validatePreviewPage(newPreviewPage, courseTitle) {
    // Validate different URL
    expect(newPreviewPage.url()).not.toBe(this.page.url());
    console.log('Original page URL:', this.page.url());
    console.log('Preview page URL:', newPreviewPage.url());
    await this.page.waitForTimeout(3000);
    
    // Validate course title on preview page
    const previewPageTitle = newPreviewPage.locator('h1').first();
    await expect(previewPageTitle).toBeVisible();
    const previewTitleText = await previewPageTitle.textContent();
    expect(previewTitleText.trim()).toBe(courseTitle);
    console.log('Course title validation successful:', previewTitleText);
    
    // Take screenshot
    await newPreviewPage.screenshot({ path: 'course-preview-page.png', fullPage: true });
    console.log('Screenshot saved as course-preview-page.png');
  }

  async closePreviewAndReturnToEditor(newPreviewPage) {
    await newPreviewPage.close();
    await this.page.bringToFront();
    await this.page.waitForTimeout(3000);
    
    // Validate we're back on the original course editing page
    await expect(this.page.locator("//a[normalize-space()='Preview']")).toBeVisible();
    console.log('Successfully returned to course editing page');
    await this.page.waitForTimeout(5000);
  }

  // Publish methods
  async clickPublish() {
    const publishButton = this.page.locator("//button[normalize-space()='Publish']");
    await publishButton.click();
    await this.page.waitForTimeout(3000);
  }

  async verifyPublishSuccess() {
    // Validate success notification
    const successNotification = this.page.locator("//div[contains(@class, 'components-notice') and contains(@class, 'is-success')] | //div[contains(@class, 'crlms-notice-wrapper')] | //div[contains(text(), 'Course has been published successfully')]").first();
    await expect(successNotification).toBeVisible({ timeout: 10000 });

    const notificationText = await successNotification.textContent();
    expect(notificationText).toContain('Course has been published successfully');
    console.log('Success notification appeared:', notificationText.trim());

    await this.page.screenshot({ path: 'course-published-success.png', fullPage: true });
    console.log('Screenshot saved as course-published-success.png');
    await this.page.waitForTimeout(3000);
  }

  async verifyPublishButtonChangedToUpdate() {
    const updateButton = this.page.locator("//button[normalize-space()='Update']");
    await this.page.waitForTimeout(3000);
    await expect(updateButton).toBeVisible();
    await this.page.waitForTimeout(3000);
    console.log('✅ Publish button has changed to Update button successfully');
    await this.page.waitForTimeout(3000);

    const publishButtonAfter = this.page.locator("//button[normalize-space()='Publish']");
    await this.page.waitForTimeout(3000);
    await expect(publishButtonAfter).not.toBeVisible();
    console.log('✅ Publish button is no longer visible after course publication');
    await this.page.waitForTimeout(3000);
  }

  // Navigation back to courses list
  async clickBackButton() {
    const backButton = this.page.locator("//button[normalize-space()='Back']");
    await this.page.waitForTimeout(3000);
    await backButton.click();
    await this.page.waitForTimeout(3000);
  }

  async verifyBackOnAllCoursesPage() {
    const allCoursesHeadingAfter = this.page.locator("//h1[normalize-space()='All Courses']");
    await this.page.waitForTimeout(3000);
    await expect(allCoursesHeadingAfter).toBeVisible({ timeout: 10000 });
    console.log('✅ Successfully navigated back to All Courses page');
    await this.page.waitForTimeout(3000);
  }

  // Course validation methods
  async findCourseInList(courseTitle) {
    const createdCourseRow = this.page.locator(`//tr[contains(., '${courseTitle}')]`);
    await this.page.waitForTimeout(3000);
    await expect(createdCourseRow).toBeVisible({ timeout: 10000 });
    console.log('✅ Created course found in the courses list');
    await this.page.waitForTimeout(3000);
  }

  async verifyPublishedStatus() {
    const publishedStatus = this.page.locator("//tr[contains(@class,'crlms-tr crlms-tr-0')]//span[contains(@class,'crlms-badge crlms-badge-success crlms-badge-borderless')][normalize-space()='Published']");
    await this.page.waitForTimeout(3000);
    await expect(publishedStatus).toBeVisible({ timeout: 5000 });
    console.log('✅ Course status is showing as Published');

    await this.page.screenshot({ path: 'all-courses-with-published-course.png', fullPage: true });
    console.log('Screenshot saved as all-courses-with-published-course.png');
  }

  // Delete course methods
  async openCourseActionMenu(courseTitle) {
    await this.page.waitForTimeout(3000);
    const actionDotsButton = this.page.locator(`//tr[contains(., '${courseTitle}')]//button[@class='components-button components-dropdown-menu__toggle has-icon']`);
    await this.page.waitForTimeout(3000);
    await actionDotsButton.click();
    await this.page.waitForTimeout(2000);
    console.log('✅ Clicked on action menu (3 dots) for the published course');
    await this.page.waitForTimeout(3000);
  }

  async clickDeleteOption() {
    const deleteOption = this.page.locator("//span[normalize-space()='Delete']");
    await this.page.waitForTimeout(3000);
    await deleteOption.click();
    await this.page.waitForTimeout(2000);
    console.log('✅ Clicked on Delete option from the dropdown menu');
    await this.page.waitForTimeout(3000);
  }

  async verifyDeleteConfirmationModal() {
    const deleteModal = this.page.locator("h4:has-text('Delete Course')").first();
    await this.page.waitForTimeout(3000);
    await expect(deleteModal).toBeVisible();
    console.log('✅ Delete confirmation modal is visible');
    await this.page.waitForTimeout(3000);

    const confirmationMessage = this.page.locator("text=Are you sure you want to delete course?");
    await this.page.waitForTimeout(3000);
    await expect(confirmationMessage).toBeVisible();
    console.log('✅ Delete confirmation message validated');
    await this.page.waitForTimeout(3000);

    await this.page.screenshot({ path: 'delete-confirmation-modal.png' });
    console.log('✅ Screenshot taken of delete confirmation modal');
    await this.page.waitForTimeout(3000);
  }

  async confirmDelete() {
    const deleteButton = this.page.locator("//button[normalize-space()='Delete']");
    await this.page.waitForTimeout(3000);
    await deleteButton.click();
    await this.page.waitForTimeout(3000);
    console.log('✅ Clicked on Delete button to confirm course deletion');
  }

  async verifyDeleteSuccess() {
    await this.page.waitForTimeout(3000);
    const deleteSuccessNotification = this.page.locator("text=Deleted Successfully");
    await this.page.waitForTimeout(3000);
    await expect(deleteSuccessNotification).toBeVisible();
    console.log('✅ "Deleted Successfully" notification is visible');
    await this.page.waitForTimeout(3000);

    await this.page.screenshot({ path: 'course-deleted-successfully.png' });
    console.log('✅ Screenshot taken of delete success notification');
    await this.page.waitForTimeout(3000);

    await this.page.waitForTimeout(5000);
    console.log('✅ Course deletion workflow completed successfully');
  }

  async verifyCourseRemovedFromList(courseTitle) {
    await this.page.waitForTimeout(3000);
    const deletedCourseRow = this.page.locator(`text=${courseTitle}`);
    await this.page.waitForTimeout(3000);
    await expect(deletedCourseRow).not.toBeVisible();
    console.log(`✅ Validated that course "${courseTitle}" is no longer visible in the course list`);

    await this.page.waitForTimeout(3000);
    await this.page.screenshot({ path: 'course-list-after-deletion.png' });
    console.log('✅ Final screenshot taken of course list after deletion');

    await this.page.waitForTimeout(3000);
    const courseRows = this.page.locator('tbody tr');
    await this.page.waitForTimeout(3000);
    const courseCount = await courseRows.count();
    await this.page.waitForTimeout(3000);

    if (courseCount === 0) {
      console.log('✅ Course list is now empty - all courses have been deleted');
    } else {
      console.log(`✅ Course list now contains ${courseCount} course(s) - deleted course successfully removed`);
    }
  }

  // Combined workflow methods
  async completeFullCourseCreation(courseData) {
    // Navigate to courses
    await this.navigateToCreatorLMS();
    await this.navigateToCourses();
    
    // Add new course
    await this.clickAddCourse();
    await this.startFromScratch();
    
    // Fill course details
    const courseTitle = await this.fillCourseTitle(courseData.title);
    await this.fillCourseDescription(courseData.description);
    
    // Upload media
    await this.uploadCourseThumbnail();
    await this.uploadCourseVideo();
    
    // Fill chapter details
    await this.fillChapterName(courseData.chapterName);
    await this.fillChapterDescription(courseData.chapterDescription);
    
    // Navigate through steps
    await this.clickNextButton();
    await this.clickNextButtonAgain();
    
    // Preview validation
    const previewPage = await this.openPreview();
    await this.validatePreviewPage(previewPage, courseTitle);
    await this.closePreviewAndReturnToEditor(previewPage);
    
    // Publish course
    await this.clickPublish();
    await this.verifyPublishSuccess();
    await this.verifyPublishButtonChangedToUpdate();
    
    // Navigate back and verify
    await this.clickBackButton();
    await this.verifyBackOnAllCoursesPage();
    await this.findCourseInList(courseTitle);
    await this.verifyPublishedStatus();
    
    return courseTitle;
  }

  async deleteCourseFromList(courseTitle) {
    await this.openCourseActionMenu(courseTitle);
    await this.clickDeleteOption();
    await this.verifyDeleteConfirmationModal();
    await this.confirmDelete();
    await this.verifyDeleteSuccess();
    await this.verifyCourseRemovedFromList(courseTitle);
  }
}
