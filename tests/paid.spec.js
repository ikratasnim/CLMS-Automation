import { test, expect } from '@playwright/test';

const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

test('dynamic login to WordPress', async ({ page }, testInfo) => {

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

  // Wait for the Courses page to load
  await page.waitForTimeout(3000);


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
  await page.waitForTimeout(5000);
  await expect(courseTitlePlaceholder).toBeVisible();

  // Click on the 'Enter Course Title' placeholder and input the course title
  await courseTitlePlaceholder.click();
  await courseTitlePlaceholder.fill('Paid course test');



  // Find the 'Enter chapter name' placeholder text and click on it
  const chapterNamePlaceholder = page.locator("input[placeholder='Enter chapter name']");
  await chapterNamePlaceholder.click();

  // Input 'Fundamentals of Software Testing and Test Design' into the 'Enter chapter name' field
  await chapterNamePlaceholder.fill('chapter 1');
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
  const lessonTitle = 'text 1';

  // Fill the 'Enter lesson title' field with the specified text
  await lessonTitlePlaceholder.fill(lessonTitle);
  await page.waitForTimeout(1000);

 await page.waitForTimeout(3000);
  
  // Click on the 'Save' button from the top right corner
  const saveButton = page.locator("button", { hasText: 'Save' });
  await page.waitForTimeout(3000);
  await saveButton.click();
  await page.waitForTimeout(3000);


  // Click on the close button beside the save button at the top right corner
  const closeButton = page.getByRole('button', { name: 'Close' }).first();
  await page.waitForTimeout(3000);
  await closeButton.click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('radio', { name: 'Paid' }).click();
  await page.waitForTimeout(3000);
  await page.locator('//div[contains(@class, "crlms-price-range")]//input[@placeholder="0.00" and @type="number"]').first().fill('10');
  await page.waitForTimeout(3000);

  // Validate that the price was set successfully
  const priceField = page.locator('//div[contains(@class, "crlms-price-range")]//input[@placeholder="0.00" and @type="number"]').first();
  await expect(priceField).toHaveValue('10');
  
  console.log('✅ Paid course setup completed successfully with price $10');

  await page.locator("//button[normalize-space()='Next']").click();
  await page.waitForTimeout(3000);
  const publishButton = page.locator("//button[normalize-space()='Publish']");
  await page.waitForTimeout(5000);
  await publishButton.click();
  await page.waitForTimeout(5000);

  console.log('✅ Course published successfully');
  await page.waitForTimeout(3000);

  // Extract course ID from current URL after publishing
  const currentUrl = page.url();
  await page.waitForTimeout(3000);
  console.log(`Current URL after publishing: ${currentUrl}`);
  
  // Extract course ID from URL (assuming URL pattern contains course ID)
  await page.waitForTimeout(3000);
  const courseIdMatch = currentUrl.match(/course[s]?[/-](\d+)/i) || currentUrl.match(/id[=](\d+)/i) || currentUrl.match(/(\d+)/);
  await page.waitForTimeout(3000);
  let courseId = null;
  if (courseIdMatch) {
    await page.waitForTimeout(3000);
    courseId = courseIdMatch[1];
    console.log(`Extracted course ID: ${courseId}`);
  } else {
    console.log('Could not extract course ID from URL, will use fallback locators');
  }

  // Click on the Preview link to validate price in frontend (specifically target the link that opens new tab)
  const previewLink = page.locator("//a[contains(text(),'Preview')]").or(page.getByRole('link', { name: 'Preview' }));
  await page.waitForTimeout(3000);
  
  // Wait for new tab to open after clicking preview
  const [newTab] = await Promise.all([
    page.context().waitForEvent('page'),
    await page.waitForTimeout(3000),
    previewLink.click()
  ]);
  
  await page.waitForTimeout(3000);
  console.log('✅ Preview button clicked, new tab opened');

  // Switch to the new tab and wait for it to load
  //await newTab.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Get the new tab URL to extract course ID if not found from previous URL
  const newTabUrl = newTab.url();
  console.log(`New tab URL: ${newTabUrl}`);
  
  if (!courseId) {
    const newTabCourseIdMatch = newTabUrl.match(/course[s]?[/-](\d+)/i) || newTabUrl.match(/(\d+)/);
    if (newTabCourseIdMatch) {
      courseId = newTabCourseIdMatch[1];
      console.log(`Extracted course ID from new tab URL: ${courseId}`);
    }
  }

  // Validate that the price amount '10' is visible on the preview page using extracted course ID
  let priceOnPreview;
  if (courseId) {
    // Use specific course ID locator
    priceOnPreview = newTab.locator(`//*[@id="course-${courseId}"]/div[1]/div/aside/div[2]/div[1]/div[1]/span/bdi`);
    console.log(`Using specific course ID locator: course-${courseId}`);
  } else {
    // Use fallback locators
    priceOnPreview = newTab.locator("//*[starts-with(@id,'course-')]//span//bdi | //span//bdi[contains(text(),'10')] | //*[contains(text(),'10')]");
    console.log('Using fallback locators for price validation');
  }
  
  await expect(priceOnPreview.first()).toBeVisible();
  
  // Get the actual price text from preview page
  const previewPriceText = await priceOnPreview.first().textContent();
  console.log(`📋 Price found on preview page: ${previewPriceText}`);
  
  // Validate that the price contains '10'
  expect(previewPriceText).toMatch(/.*10.*/);
  
  console.log('✅ Course price amount "10" validated successfully on preview page');

  // Close the preview tab and return to the original tab
  await newTab.close();
  await page.waitForTimeout(2000);
  
  console.log('✅ Preview tab closed, returning to main page');

  // Click on the back button from top left side to go back to course listing page
  const backButton = page.locator("//button[contains(.,'Back')]").or(page.locator("//button[@aria-label='Back']")).or(page.locator("//img[@alt='Back']/../.."));
  await page.waitForTimeout(3000);
  await backButton.click();
  await page.waitForTimeout(5000);

  console.log('✅ Clicked back button, navigating to course listing page');

  // Wait for the course listing page to load completely
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Validate that the course name 'Paid course test' exists on the listing page
  const courseNameOnListing = page.locator("//td[contains(text(),'Paid course test')] | //span[contains(text(),'Paid course test')] | //div[contains(text(),'Paid course test')]");
  await expect(courseNameOnListing).toBeVisible();
  
  console.log('✅ Course name "Paid course test" found on the listing page');

  // Find the row containing the course and validate the price column shows $10
  // Look for the price in the same row as the course name
  const courseRow = page.locator("//tr[.//text()[contains(.,'Paid course test')]]");
  await expect(courseRow).toBeVisible();
  
  // Check if the price column in the same row contains amount 10 (without currency symbol)
  const priceInRow = courseRow.locator("//*[contains(text(),'10')]");
  await expect(priceInRow).toBeVisible();
  
  console.log('✅ Course price amount "10" validated successfully in the listing page');
  
  // Additional validation: Get the actual price text and verify it matches our expected value
  const priceText = await priceInRow.textContent();
  console.log(`📋 Price found in listing: ${priceText}`);
  
  // Validate that the price contains '10' (amount only)
  expect(priceText).toMatch(/.*10.*/);
  
  console.log('✅ All validations passed - Course created, published, and price amount verified on listing page');

});
