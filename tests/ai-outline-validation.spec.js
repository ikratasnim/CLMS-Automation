const { test, expect } = require('@playwright/test');

// Global helper for login and navigation to AI outline page
async function loginAndNavigateToAI(page, username, password) {
  await page.goto('http://creator-lms-automation.local/wp-login.php');
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');
  await expect(page).toHaveURL(/wp-admin/);
  await page.hover('text=Creator LMS');
  await page.click('text=Courses');
  await page.click('text=Add Course');
  await page.click("//h4[normalize-space()='Generate Outline with AI']");
  const aiHeader = page.locator("//h2[normalize-space()='Creator LMS AI']");
  await expect(aiHeader).toBeVisible();
}

test('accept outline', async ({ page }) => {
  await loginAndNavigateToAI(page, 'root', 'root');
  const prompt = "Generate a course outline with a course title that must include either 'Mindful' or 'Mindfulness'.";
  await page.click("//textarea[contains(@placeholder, 'Ask AI to generate')]");
  await page.fill("//textarea[contains(@placeholder, 'Ask AI to generate')]", prompt);
  // Click the arrow icon to submit the prompt
  await page.click("//button[@class='components-button is-primary has-icon']//*[name()='svg']");
  await page.waitForTimeout(6000);

  // Validate the generated outline
  const generatedTitle1 = await page.textContent("//h2[contains(text(),'Course title:')]");
  await page.waitForTimeout(3000);
  console.log('Generated Title:', generatedTitle1);
  expect(generatedTitle1).toMatch(/mindful(ness)?/i);

  // Validate at least one chapter exists
  const chapterExists1 = await page.locator('p', { hasText: /^Chapter \d+:/ }).count();
  expect(chapterExists1).toBeGreaterThan(0);
  console.log('Chapter count:', chapterExists1);

  // Validate at least one lesson exists
  const lessonExists1 = await page.locator('div').filter({ hasText: /^Lesson \d+\.\d+:/ }).count();
  expect(lessonExists1).toBeGreaterThan(0);
  console.log('Lesson count:', lessonExists1);

  // Take a screenshot after all validations
  await page.screenshot({ path: 'ai-outline-result.png', fullPage: true });

  // Accept Outline and validate redirect to course builder
  await page.click('button:has-text("Accept Outline")');
  // Validate step names are visible (Content, Settings, Preview)
  await expect(page.getByText('1Content2Settings3Preview')).toBeVisible();

  // Validate cover image thumbnail is visible
  const coverImage = await page.locator('.crlms-course-thumb-controls');
  const coverVisible = await coverImage.isVisible();
  expect(coverVisible).toBeTruthy();

  // Take a screenshot after redirect
  await page.screenshot({ path: 'course-builder-result.png', fullPage: true });

  // Validate AI-generated title is placed in the Enter Course Title input and matches the original
  let courseTitleInput = '';
  try {
    courseTitleInput = await page.inputValue('input[placeholder="Enter Course Title"], input[aria-label="Course Title"]');
  } catch (e) {
    courseTitleInput = await page.textContent('h1, h2, h3');
  }
  console.log('Course Title Input:', courseTitleInput);
  expect(courseTitleInput.trim()).toBe(generatedTitle1.replace('Course title: ', '').trim());
});

test('regenerate outline', async ({ page }) => {
  await loginAndNavigateToAI(page, 'root', 'root');
  const prompt = "Generate a course outline with a course title that must include either 'Mindful' or 'Mindfulness'.";
  await page.click("//textarea[contains(@placeholder, 'Ask AI to generate')]");
  await page.fill("//textarea[contains(@placeholder, 'Ask AI to generate')]", prompt);
  // Click the arrow icon to submit the prompt
  await page.click("//button[@class='components-button is-primary has-icon']//*[name()='svg']");
  await page.waitForTimeout(6000);

  // Validate the generated outline
  const generatedTitle1 = await page.textContent("//h2[contains(text(),'Course title:')]");
  await page.waitForTimeout(3000);
  console.log('Generated Title (Tab 1):', generatedTitle1);
  expect(generatedTitle1).toMatch(/mindful(ness)?/i);

  // Validate at least one chapter exists
  const chapterExists1 = await page.locator('p', { hasText: /^Chapter \d+:/ }).count();
  expect(chapterExists1).toBeGreaterThan(0);
  console.log('Chapter count:', chapterExists1);

  // Validate at least one lesson exists
  const lessonExists1 = await page.locator('div').filter({ hasText: /^Lesson \d+\.\d+:/ }).count();
  expect(lessonExists1).toBeGreaterThan(0);
  console.log('Lesson count:', lessonExists1);

  // Save the course title before regeneration
  const courseTitleBefore = generatedTitle1.replace('Course title: ', '').trim();

  // Before regeneration, check that the tab count indicator is not visible
  await expect(page.getByText('12')).not.toBeVisible();

  // Click Regenerate Outline
  await page.click('button:has-text("Regenerate Outline")');
  await page.waitForTimeout(4000);

  // After regeneration, check that the tab count indicator '12' is visible
  await expect(page.getByText('12')).toBeVisible();
  // Check that the 2nd tab is selected by background color (e.g., has a selected class or style)
  const tab2 = page.getByRole('button', { name: '2' });
  await expect(tab2).toBeVisible();
  // Check for selected state by class or style (adjust selector as needed)
  const tab2Bg = await tab2.evaluate(node => window.getComputedStyle(node).backgroundColor);
  console.log('Tab 2 background color:', tab2Bg);
  expect(tab2Bg).not.toBe('rgba(0, 0, 0, 0)'); // Should not be transparent if selected

  // Store the current tab's course title and validate it is not matching the previous
  const generatedTitle2 = await page.textContent("//h2[contains(text(),'Course title:')]");
  console.log('Generated Title (Tab 2):', generatedTitle2);
  const courseTitleAfter = generatedTitle2.replace('Course title: ', '').trim();
  expect(courseTitleAfter).not.toBe(courseTitleBefore);
  console.log('Course title before regeneration:', courseTitleBefore);
  console.log('Course title after regeneration:', courseTitleAfter);
  console.log('Are course titles different?', courseTitleAfter !== courseTitleBefore);
  await page.screenshot({ path: 'ai-outline-regenerate-result.png', fullPage: true });
});

test('edit prompt', async ({ page }) => {
  await loginAndNavigateToAI(page, 'root', 'root');
  const prompt = "Generate a course outline with a course title that must include either 'Mindful' or 'Mindfulness'.";
  await page.click("//textarea[contains(@placeholder, 'Ask AI to generate')]");
  await page.fill("//textarea[contains(@placeholder, 'Ask AI to generate')]", prompt);
  // Click the arrow icon to submit the prompt
  await page.click("//button[@class='components-button is-primary has-icon']//*[name()='svg']");
  await page.waitForTimeout(6000);

  // Validate the generated outline
  const generatedTitle1 = await page.textContent("//h2[contains(text(),'Course title:')]");
  await page.waitForTimeout(3000);
  console.log('Generated Title:', generatedTitle1);
  expect(generatedTitle1).toMatch(/mindful(ness)?/i);

  // Validate at least one chapter exists
  const chapterExists1 = await page.locator('p', { hasText: /^Chapter \d+:/ }).count();
  expect(chapterExists1).toBeGreaterThan(0);
  console.log('Chapter count:', chapterExists1);

  // Validate at least one lesson exists
  const lessonExists1 = await page.locator('div').filter({ hasText: /^Lesson \d+\.\d+:/ }).count();
  expect(lessonExists1).toBeGreaterThan(0);
  console.log('Lesson count:', lessonExists1);

  // Click the Edit Prompt button
  await page.getByRole('button', { name: 'Edit Prompt' }).click();
  await page.waitForTimeout(1000);
  // Remove the existing prompt and fill with editedPrompt
  const editedPrompt = "Generate a detailed course outline on graphic design with at least 2 chapters. The course title must include 'graphic design'.";
  await page.fill("//textarea[contains(@placeholder, 'Ask AI to generate')]", '');
  await page.fill("//textarea[contains(@placeholder, 'Ask AI to generate')]", editedPrompt);
  // Click the arrow icon to submit the edited prompt
  await page.click("//button[@class='components-button is-primary has-icon']//*[name()='svg']");
  await page.waitForTimeout(6000);

  // Validate the updated outline
  const updatedTitle = await page.textContent("//h2[contains(text(),'Course title:')]");
  await page.waitForTimeout(3000);
  console.log('Updated Title:', updatedTitle);
  expect(updatedTitle).toMatch(/graphic design/i);
  // Validate the updated title is different from the previous title
  expect(updatedTitle.trim()).not.toBe(generatedTitle1.trim());
  console.log('Previous Title:', generatedTitle1);
  console.log('Updated Title:', updatedTitle);

  /*// Validate the new outline has more chapters and lessons
  const updatedChapterCount = await page.locator('p', { hasText: /^Chapter \d+:/ }).count();
  expect(updatedChapterCount).toBeGreaterThan(chapterExists1);
  console.log('Updated Chapter count:', updatedChapterCount);

  const updatedLessonCount = await page.locator('div').filter({ hasText: /^Lesson \d+\.\d+:/ }).count();
  expect(updatedLessonCount).toBeGreaterThan(lessonExists1);
  console.log('Updated Lesson count:', updatedLessonCount);*/

  // Take a screenshot of the updated outline
  await page.screenshot({ path: 'ai-outline-edited-result.png', fullPage: true });
});
