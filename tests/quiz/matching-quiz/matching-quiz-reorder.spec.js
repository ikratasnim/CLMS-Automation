import { test, expect } from '@playwright/test';

// Test Configuration
const adminURL = 'http://creator-lms-automation.local';
const adminLoginURL = `${adminURL}/wp-login.php`;
const username = 'root';
const password = 'root';

/**
 * Test Suite: Matching Interactive Quiz Question - Reorder Operations
 * 
 * Purpose: Validates drag & drop reordering functionality for Matching quiz question pairs
 * 
 * Test Cases:
 * 1. Reorder matching pairs - Drag & drop to swap pair positions and validate
 * 
 * Test Flow:
 * - Create matching question with 2 pairs (no images)
 * - Store values of both pairs (Match Item & Matching definition)
 * - Drag second pair (bottom) to first position (top)
 * - Retrieve values after drag operation
 * - Validate: Compare before/after values to confirm successful reorder
 * 
 * Features Tested:
 * - Drag & drop reordering of matching pairs
 * - Value preservation during drag operation
 * - Position swapping validation
 * 
 * Dependencies:
 * - WordPress admin access
 * - Creator LMS plugin installed
 * - Drag and drop functionality enabled
 * 
 * Note: Tests have 2-minute timeout for complex operations
 */

test.describe('Matching Interactive Quiz Question - Reorder Operations', () => {
  
  test('should reorder matching pairs using drag and drop', async ({ page }) => {
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
    await courseTitleInput.fill('Reorder Pairs Test');
    await page.waitForTimeout(2000);

    const chapterTitleInput = page.locator("input[placeholder='Enter chapter name']");
    await chapterTitleInput.fill('Reorder Chapter');
    await page.waitForTimeout(2000);

    const addContentButton = page.locator("button", { hasText: 'Add content' });
    await addContentButton.click();
    await page.waitForTimeout(3000);

    const quizOption = page.getByRole('button', { name: 'Quiz Evaluate members with a' });
    await quizOption.click();
    await page.waitForTimeout(3000);

    const quizTitleInput = page.getByRole('textbox', { name: 'Enter Quiz Title' });
    await quizTitleInput.fill('Reorder Pairs Quiz');
    await page.waitForTimeout(2000);

    const interactiveTab = page.getByRole('tab', { name: 'Interactive' });
    await interactiveTab.click();
    await page.waitForTimeout(3000);

    const matchingType = page.getByRole('button', { name: 'Quiz: Matching' });
    const matchingDragDropArea = page.getByText('Drag & DropDrag and drop a');
    await matchingType.dragTo(matchingDragDropArea);
    await page.waitForTimeout(2000);

    // Fill question
    const questionInput = page.getByRole('textbox', { name: 'Type your question here' });
    await questionInput.click();
    await questionInput.fill('Test reorder matching pairs');
    await page.waitForTimeout(2000);

    // Fill first pair (top option)
    const firstMatchItem = page.getByPlaceholder('Match Item').first();
    await firstMatchItem.click();
    await firstMatchItem.fill('First Item');
    await page.waitForTimeout(1000);

    const firstMatchDefinition = page.getByPlaceholder('Matching definition').first();
    await firstMatchDefinition.click();
    await firstMatchDefinition.fill('First Definition');
    await page.waitForTimeout(1000);

    // Fill second pair (bottom option)
    const secondMatchItem = page.getByPlaceholder('Match Item').nth(1);
    await secondMatchItem.click();
    await secondMatchItem.fill('Second Item');
    await page.waitForTimeout(1000);

    const secondMatchDefinition = page.getByPlaceholder('Matching definition').nth(1);
    await secondMatchDefinition.click();
    await secondMatchDefinition.fill('Second Definition');
    await page.waitForTimeout(2000);

    console.log('✅ Created 2 matching pairs (without images)');

    // Store values BEFORE drag and drop
    await page.waitForTimeout(2000);    
    const firstItemBefore = await page.getByPlaceholder('Match Item').first().inputValue();
    await page.waitForTimeout(2000); 
    const firstDefBefore = await page.getByPlaceholder('Matching definition').first().inputValue();
    await page.waitForTimeout(2000); 
    const secondItemBefore = await page.getByPlaceholder('Match Item').nth(1).inputValue();
    await page.waitForTimeout(2000); 
    const secondDefBefore = await page.getByPlaceholder('Matching definition').nth(1).inputValue();

    console.log('📝 Values BEFORE drag and drop:');
    console.log(`  Position 1: Item="${firstItemBefore}", Definition="${firstDefBefore}"`);
    console.log(`  Position 2: Item="${secondItemBefore}", Definition="${secondDefBefore}"`);
    
    await page.screenshot({ path: 'reorder-before-drag.png', fullPage: true });

    // Perform drag and drop - drag second pair (bottom) to first position (top)
    console.log('🔍 Dragging second pair to first position...');
    
    // Find all matching pair containers dynamically
    await page.waitForTimeout(2000);
    const pairContainers = page.locator('.crlms-box-wrapper > div').filter({
      has: page.locator('input[placeholder="Match Item"]')
    });
    
    const pairCount = await pairContainers.count();
    console.log(`Found ${pairCount} matching pair containers`);
    
    if (pairCount >= 2) {
      const firstOption = pairContainers.first();
      const secondOption = pairContainers.nth(1);
      
      // Drag second option to first position
      await page.waitForTimeout(2000);
      await secondOption.dragTo(firstOption, { force: true });
      await page.waitForTimeout(2000);
      console.log('✅ Performed drag and drop operation');
    } else {
      console.log(`⚠️ Expected at least 2 pairs, found ${pairCount}`);
    }
      
    await page.screenshot({ path: 'reorder-after-drag.png', fullPage: true });
      
    // Get values AFTER drag and drop
    const firstItemAfter = await page.getByPlaceholder('Match Item').first().inputValue();
    const firstDefAfter = await page.getByPlaceholder('Matching definition').first().inputValue();
    const secondItemAfter = await page.getByPlaceholder('Match Item').nth(1).inputValue();
    const secondDefAfter = await page.getByPlaceholder('Matching definition').nth(1).inputValue();
      
    console.log('📝 Values AFTER drag and drop:');
    console.log(`  Position 1: Item="${firstItemAfter}", Definition="${firstDefAfter}"`);
    console.log(`  Position 2: Item="${secondItemAfter}", Definition="${secondDefAfter}"`);
      
    // Validate: First position should now have what was previously in second position
    // and second position should have what was previously in first position
    if (firstItemAfter === secondItemBefore && 
        firstDefAfter === secondDefBefore && 
        secondItemAfter === firstItemBefore && 
        secondDefAfter === firstDefBefore) {
      console.log('✅ VALIDATION PASSED: Drag and drop successfully reordered the pairs!');
      console.log('   - Bottom pair moved to top position');
      console.log('   - Top pair moved to bottom position');
    } else {
      console.log('❌ VALIDATION FAILED: Pairs were not reordered as expected');
      console.log(`   Expected position 1: Item="${secondItemBefore}", Definition="${secondDefBefore}"`);
      console.log(`   Actual position 1: Item="${firstItemAfter}", Definition="${firstDefAfter}"`);
    }
      
    // Assert with Playwright expect
    expect(firstItemAfter).toBe(secondItemBefore);
    expect(firstDefAfter).toBe(secondDefBefore);
    expect(secondItemAfter).toBe(firstItemBefore);
    expect(secondDefAfter).toBe(firstDefBefore);
      
    console.log('✅ Reorder matching pairs test completed successfully');
  });
});
