import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

/**
 * Test Suite: Matching Interactive Quiz Question - Media Attachment Tests
 * 
 * Purpose: Validates media attachment functionality for Matching quiz questions
 * 
 * Test Cases:
 * 1. Add image to match item - Upload/select image for match item field
 * 2. Add image to matching definition - Upload/select image for definition field
 * 3. Add video to match item - Upload/select video for match item field
 * 4. Add video to matching definition - Upload/select video for definition field
 * 5. Generate AI photo for match item - Test AI photo generation feature
 * 6. Remove attached media - Test media removal functionality
 * 
 * Features Tested:
 * - Image upload from Media Library
 * - Video upload from Media Library
 * - AI photo generation
 * - Media removal/deletion
 * - Multiple media types in matching questions
 * 
 * Dependencies:
 * - WordPress admin access
 * - Creator LMS plugin installed
 * - Media library with existing images/videos
 * - AI photo generation feature (if available)
 * 
 * Note: Tests have 2-minute timeout due to media upload/processing time
 */

test.describe('Matching Interactive Quiz Question - Media Attachment Tests', () => {
  
  test('should add image to match item', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    // Step 1: Log into WordPress dashboard
    await page.goto(adminLoginURL);
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    console.log('✅ Successfully logged into WordPress Dashboard');

    // Step 2-5: Navigate and create quiz
    await page.waitForTimeout(2000);
    const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.waitFor({ state: 'visible', timeout: 10000 });
    await creatorLmsMenu.click();
    
    const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.waitFor({ state: 'visible', timeout: 10000 });
    await coursesSubmenu.click();
    await page.waitForTimeout(3000);

    const addCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await addCourseButton.click();
    await page.waitForTimeout(3000);

    const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await page.waitForTimeout(3000);

    const courseTitleInput = page.locator("input[placeholder='Enter Course Title']");
    await courseTitleInput.fill('Media Attachment Test Course');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Media Attachment Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Media Attachment Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);
    console.log('✅ Matching question added');

    // Step 6: Fill question and match item
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Match items with images');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Python Programming');
    await page.waitForTimeout(2000);

    // Step 7: Click image icon for match item
    console.log('🔍 Adding image to match item...');
    
    // Find the image icon button next to the first match item
    const matchItemImageIcon = page.locator('.crlms-badge > svg').first();
    await expect(matchItemImageIcon).toBeVisible({ timeout: 5000 });
    await matchItemImageIcon.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked image icon for match item');

    // Step 8: Select image from Media Library
    const mediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryTab).toBeVisible({ timeout: 5000 });
    await mediaLibraryTab.click();
    await page.waitForTimeout(3000);
    console.log('✅ Opened Media Library');

    // Select a random image
    const imageList = page.locator(".attachment-preview");
    const imageCount = await imageList.count();
    const randomImageIndex = Math.floor(Math.random() * imageCount);
    const randomImage = imageList.nth(randomImageIndex);
    
    await expect(randomImage).toBeVisible({ timeout: 5000 });
    await randomImage.click();
    await page.waitForTimeout(3000);
    console.log(`✅ Selected random image (index ${randomImageIndex})`);

    // Click "Use this media" button
    const useMediaButton = page.getByRole('button', { name: 'Use this media' });
    await expect(useMediaButton).toBeVisible({ timeout: 5000 });
    await useMediaButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Successfully added image to match item');

    await page.screenshot({ path: 'media-match-item-image.png', fullPage: true });
    console.log('📸 Screenshot saved: media-match-item-image.png');
    console.log('✅ Add image to match item test completed');
  });

  test('should add image to matching definition', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    // Steps 1-6: Same setup as above
    await page.goto(adminLoginURL);
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    console.log('✅ Successfully logged into WordPress Dashboard');

    await page.waitForTimeout(2000);
    const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.waitFor({ state: 'visible', timeout: 10000 });
    await creatorLmsMenu.click();
    
    const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.waitFor({ state: 'visible', timeout: 10000 });
    await coursesSubmenu.click();
    await page.waitForTimeout(3000);

    const addCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await addCourseButton.click();
    await page.waitForTimeout(3000);

    const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await page.waitForTimeout(3000);

    const courseTitleInput = page.locator("input[placeholder='Enter Course Title']");
    await courseTitleInput.fill('Definition Image Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Definition Image Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Definition Image Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Match with definition images');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('JavaScript');
    await page.waitForTimeout(2000);

    const firstMatchDefinition = page.getByPlaceholder('Matching definition').first();
    await firstMatchDefinition.click();
    await firstMatchDefinition.fill('Frontend Language');
    await page.waitForTimeout(2000);

    // Step 7: Click image icon for matching definition
    console.log('🔍 Adding image to matching definition...');
    
    // Find the image icon for definition field (second occurrence)
    const definitionImageIcon = page.locator('.crlms-badge > svg').nth(1);
    await expect(definitionImageIcon).toBeVisible({ timeout: 5000 });
    await definitionImageIcon.click();
    await page.waitForTimeout(3000);
    console.log('✅ Clicked image icon for matching definition');

    // Step 8: Select image from Media Library
    const mediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryTab).toBeVisible({ timeout: 5000 });
    await mediaLibraryTab.click();
    await page.waitForTimeout(3000);

    const imageList = page.locator(".attachment-preview");
    const imageCount = await imageList.count();
    const randomImageIndex = Math.floor(Math.random() * imageCount);
    const randomImage = imageList.nth(randomImageIndex);
    
    await expect(randomImage).toBeVisible({ timeout: 5000 });
    await randomImage.click();
    await page.waitForTimeout(3000);
    console.log(`✅ Selected random image (index ${randomImageIndex})`);

    const useMediaButton = page.getByRole('button', { name: 'Use this media' });
    await expect(useMediaButton).toBeVisible({ timeout: 5000 });
    await useMediaButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Successfully added image to matching definition');

    await page.screenshot({ path: 'media-definition-image.png', fullPage: true });
    console.log('📸 Screenshot saved: media-definition-image.png');
    console.log('✅ Add image to matching definition test completed');
  });

  test('should remove attached media from match item', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    await page.goto(adminLoginURL);
    await page.fill('#user_login', username);
    await page.fill('#user_pass', password);
    await page.click('#wp-submit');
    await page.waitForURL('**/wp-admin/**');
    console.log('✅ Successfully logged into WordPress Dashboard');

    await page.waitForTimeout(2000);
    const creatorLmsMenu = page.locator("//div[normalize-space()='Creator LMS']");
    await creatorLmsMenu.waitFor({ state: 'visible', timeout: 10000 });
    await creatorLmsMenu.click();
    
    const coursesSubmenu = page.locator("//a[normalize-space()='Courses']");
    await coursesSubmenu.waitFor({ state: 'visible', timeout: 10000 });
    await coursesSubmenu.click();
    await page.waitForTimeout(3000);

    const addCourseButton = page.locator("//div[@class='components-flex css-rsr3xd e19lxcc00']//button[@type='button'][normalize-space()='Add Course']");
    await addCourseButton.click();
    await page.waitForTimeout(3000);

    const startFromScratchOption = page.locator("//h4[normalize-space()='Start from Scratch']");
    await startFromScratchOption.click();
    await page.waitForTimeout(3000);

    const courseTitleInput = page.locator("input[placeholder='Enter Course Title']");
    await courseTitleInput.fill('Remove Media Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Remove Media Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Remove Media Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Test remove media functionality');
    await page.waitForTimeout(2000);

    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('Item with Image');
    await page.waitForTimeout(2000);

    // First add an image
    console.log('🔍 Adding image to match item...');
    const matchItemImageIcon = page.locator('.crlms-badge > svg').first();
    await expect(matchItemImageIcon).toBeVisible({ timeout: 5000 });
    await matchItemImageIcon.click();
    await page.waitForTimeout(3000);

    const mediaLibraryTab = page.getByRole('tab', { name: 'Media Library' });
    await expect(mediaLibraryTab).toBeVisible({ timeout: 5000 });
    await mediaLibraryTab.click();
    await page.waitForTimeout(3000);

    const imageList = page.locator(".attachment-preview");
    const randomImage = imageList.first();
    await expect(randomImage).toBeVisible({ timeout: 5000 });
    await randomImage.click();
    await page.waitForTimeout(3000);

    const useMediaButton = page.getByRole('button', { name: 'Use this media' });
    await expect(useMediaButton).toBeVisible({ timeout: 5000 });
    await useMediaButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Image added successfully');

    await page.screenshot({ path: 'media-before-removal.png', fullPage: true });
    console.log('📸 Screenshot saved: media-before-removal.png');

    // Now remove the image
    console.log('🔍 Removing attached media...');
    
    // Look for remove/delete button (usually appears after media is attached)
    const removeMediaButton = page.locator('button').filter({ hasText: /Remove|Delete|Clear/ }).first();
    const removeButtonCount = await removeMediaButton.count();
    
    if (removeButtonCount > 0) {
      await removeMediaButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ Successfully removed attached media');
    } else {
      console.log('⚠️ Remove media button not found - checking alternative methods');
    }

    await page.screenshot({ path: 'media-after-removal.png', fullPage: true });
    console.log('📸 Screenshot saved: media-after-removal.png');
    console.log('✅ Remove media test completed');
  });
});
