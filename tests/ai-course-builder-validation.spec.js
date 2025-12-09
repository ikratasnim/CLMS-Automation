import { test, expect } from '@playwright/test';

// Global helper for login and navigation to AI course builder page
async function loginAndNavigateToAI(page, username, password) {
  await page.goto('http://creator-lms-automation.local/wp-login.php');
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');
  await page.waitForTimeout(3000);
  await expect(page).toHaveURL(/wp-admin/);
  await page.waitForTimeout(3000);
  await page.hover('text=Creator LMS');
  await page.click('text=Courses');
  await page.click('text=Add Course');
}

test('start from scratch shows course title input', async ({ page }) => {
  await loginAndNavigateToAI(page, 'root', 'root');
  // Click on Start from Scratch (see ss1)
  await page.click('text=Start from Scratch');
  // Validate Enter Course Title placeholder is visible (see ss2)
  await expect(page.locator('input[placeholder="Enter Course Title"]')).toBeVisible();
});

test.describe('AI image generation', () => {
  test('should generate and use AI image as course cover', async ({ page }) => {
    await loginAndNavigateToAI(page, 'root', 'root');
    // Click on Start from Scratch
    await page.click('text=Start from Scratch');
    // Take screenshot of blank cover image thumbnail (see ss2)
    const coverThumb = page.locator('.crlms-course-thumb-controls');
    await expect(coverThumb).toBeVisible();
    await page.screenshot({ path: 'cover-thumb-blank.png', fullPage: false });

    // Click on 'generate image with ai' icon (see ss3)
    await page.click("//span[3]//button[1]//*[name()='svg']//*[name()='rect' and contains(@width,'30')]");

    // Click on 'Ask AI to generate...' prompt (see ss4)
    const aiPromptLocator = page.locator('textarea[placeholder*="Ask AI to generate"]');
    await aiPromptLocator.click();
    // Fill the prompt to generate the image
    const imagePrompt = 'A modern digital course cover — a student with a laptop, surrounded by icons like code, books, and light bulbs. Clean background, soft gradient, tech-inspired, flat 3D style.';
    await aiPromptLocator.fill(imagePrompt);
    // Click the arrow icon to submit (see ss5)
    await page.click("//button[contains(@class,'components-button is-primary has-icon')]//*[name()='svg']");
    // Wait for image generation (see ss6)
    await page.waitForTimeout(25000);
    // Validate image appears in the prompt area
    const generatedImage = page.locator('figure.generated-image-selected img, .crlms-ai-img img');
    await expect(generatedImage).toBeVisible();
    await page.screenshot({ path: 'ai-image-generated.png', fullPage: false });

    // Click on 'Use Selected Image' button (see ss7)
    await page.click('button:has-text("Use Selected Image")');
    // Validate image is placed as cover (compare with previous cover-thumb-blank.png)
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'cover-thumb-with-image.png', fullPage: false });
    // Hover over the cover image thumbnail to reveal delete icon (see ss8)
    await coverThumb.hover();
    const deleteIcon = page.locator("//div[contains(@class,'clrms-course-thumb-controls-btns')]//button[contains(@type,'button')]//*[name()='svg']//*[name()='rect' and contains(@width,'30')]");

    await expect(deleteIcon).toBeVisible();
  });
});

test.describe('write with AI', () => {
  test('should generate and accept AI course description', async ({ page }) => {
    await loginAndNavigateToAI(page, 'root', 'root');
    await page.click('text=Start from Scratch');
    // Click on add course description (ss1)
    const courseDescriptionField = page.getByRole('paragraph').first();
    await courseDescriptionField.click();
    // Click on + icon (ss2, customized locator)
    await page.click('button.crlms-editor-add-button.is-small.is-tertiary.has-icon');
    // Validate tooltip appears (ss3, customized locator)
    const tooltip = page.locator('div[role="tooltip"]:has-text("Write with AI")');
    await expect(tooltip).toBeVisible();
    // Select Write with AI from tooltip
    await page.click("//span[normalize-space()='Write with AI']");
    // Wait for prompt textarea to appear (ss3)
    const promptInput = page.locator('textarea[placeholder*="Type a prompt"]');
    await expect(promptInput).toBeVisible();
    // Provide a prompt for description
    const descPrompt = 'Write a lesson content about global warming';
    await promptInput.fill(descPrompt);
    // Click the arrow icon to submit (ss4)
    await page.click("//button[contains(@class,'components-button is-primary has-icon')]//*[name()='svg']");
    await page.waitForTimeout(10000);
  
    // Click Accept Response button (ss5)
    await page.click('button:has-text("Accept Response")');
    await page.waitForTimeout(2000);
    
    // Take screenshot of the AI generated content area and print the content (ss6)
    const generatedContentArea = page.locator('div.crlms-editor-content-wrapper').first();
    await expect(generatedContentArea).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'ai-generated-content-area.png', fullPage: false });
    
    // Print text from the first (course description) area
    const generatedContentText = await generatedContentArea.textContent();
    console.log('AI Generated Content Area Text (Course Description):', generatedContentText);
    
    // Print text from ALL matching locators
    const allContentAreas = await page.locator('div.crlms-editor-content-wrapper').all();
    for (let i = 0; i < allContentAreas.length; i++) {
      const text = await allContentAreas[i].textContent();
      console.log(`Content Area ${i + 1} Text:`, text);
    }
    
    // Validate the AI generated description contains expected keywords
    expect(generatedContentText.toLowerCase()).toContain('global warming');
    expect(generatedContentText.toLowerCase()).toContain('temperature');
    console.log('✓ AI generated content validated successfully with expected keywords');
  
  });
});
