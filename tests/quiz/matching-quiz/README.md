# Matching Quiz Test Suite

This folder contains all automated tests for the **Matching Interactive Quiz** functionality in the Creator LMS WordPress plugin.

## 📋 Test Files Overview

### 1. **matching-quiz-creation.spec.js**
- **Purpose**: Tests the basic creation of a matching quiz
- **Coverage**: 
  - Quiz creation workflow
  - Adding matching pairs
  - Basic form validation

### 2. **matching-quiz-crud.spec.js**
- **Purpose**: Tests CRUD operations for matching quiz
- **Coverage**:
  - ✅ Edit existing matching pairs
  - ✅ Copy quiz to another course
  - ❌ Delete operation (moved to separate test)

### 3. **matching-quiz-reorder.spec.js**
- **Purpose**: Tests drag & drop reordering of matching pairs
- **Coverage**:
  - ✅ Drag and drop functionality
  - ✅ Position swap validation
  - ✅ Value persistence after reorder
- **Test Strategy**: 
  - Stores values of 2 pairs before drag
  - Drags second pair to first position
  - Validates complete swap occurred

### 4. **matching-quiz-minimum-pairs.spec.js**
- **Purpose**: Tests minimum pairs validation (cannot have less than 2 pairs)
- **Coverage**:
  - ✅ Delete button functionality
  - ✅ Error message validation
  - ✅ Minimum requirement enforcement
- **Expected Behavior**: Shows "You must have at least 2 options" error

### 5. **matching-quiz-validation.spec.js**
- **Purpose**: Tests various validation rules for matching quiz
- **Coverage**:
  - Required field validation
  - Input length validation
  - Duplicate value validation

### 6. **matching-quiz-media.spec.js**
- **Purpose**: Tests media (image/video) upload functionality for matching pairs
- **Coverage**:
  - Image upload to match items
  - Image upload to definitions
  - Video upload functionality
  - Media removal/deletion

### 7. **matching-quiz-frontend-validation.spec.js**
- **Purpose**: End-to-end frontend validation of matching quiz
- **Coverage**:
  - ✅ Save quiz with notification validation
  - ✅ Preview button opens new tab
  - ✅ Quiz title validation on frontend (H1 heading)
  - ✅ Start Quiz button functionality
  - ✅ Question text display
  - ✅ All matching pair values visibility
- **Multi-Tab Testing**: Uses `context.waitForEvent('page')` for new tab handling

### 8. **matching-quiz.spec.js**
- **Purpose**: General/legacy matching quiz tests
- **Status**: May contain older tests or comprehensive scenarios

---

## 🚀 Running the Tests

### Run all matching quiz tests:
```bash
npx playwright test tests/matching-quiz/ --headed --project=chromium
```

### Run a specific test file:
```bash
npx playwright test tests/matching-quiz/matching-quiz-frontend-validation.spec.js --headed --project=chromium
```

### Run in debug mode:
```bash
npx playwright test tests/matching-quiz/matching-quiz-reorder.spec.js --headed --debug --project=chromium
```

### Run without headed mode (faster):
```bash
npx playwright test tests/matching-quiz/ --project=chromium
```

---

## 🔧 Common Locator Strategies Used

### 1. **Semantic Role Selectors** (Preferred)
```javascript
page.getByRole('button', { name: 'Save' })
page.getByRole('heading', { name: 'Quiz Title', level: 1 })
page.getByRole('textbox', { name: 'Enter Quiz Title' })
```

### 2. **Dynamic Container Locators**
```javascript
const pairContainers = page.locator('.crlms-box-wrapper > div')
  .filter({ has: page.locator('input[placeholder="Match Item"]') });
```

### 3. **XPath for Complex Elements** (When CSS fails)
```javascript
const deleteButton = page.locator("//div[@class='components-modal__screen-overlay']//div[4]//div[1]//div[1]//button[1]//*[name()='svg']");
```

### 4. **Handling Strict Mode Violations**
```javascript
// Use .first() for duplicate elements (like notifications)
const notification = page.getByText('Saved Successfully').first();

// Use specific role with level for headings
const heading = page.getByRole('heading', { name: 'Title', level: 1 });
```

---

## 📝 Test Data Patterns

### Standard Matching Quiz Setup:
```javascript
Question: "Match the programming languages with their types"
Pair 1: "Python" - "High-level Language"
Pair 2: "JavaScript" - "Scripting Language"
```

### Quiz Title Pattern:
- Frontend tests: `"Frontend Matching Quiz"`
- Backend tests: Various descriptive titles
- Reorder tests: `"Reorder Matching Quiz"`

---

## ⚠️ Known Issues & Workarounds

### 1. **Strict Mode Violations**
- **Issue**: Multiple elements with same text (nav links, headings, breadcrumbs)
- **Solution**: Use `getByRole()` with specific attributes or `.first()`

### 2. **Generated Class Names**
- **Issue**: Drag handle classes are auto-generated and unstable
- **Solution**: Use structural locators with `.filter()` and `has:` option

### 3. **Delete Button Locator**
- **Issue**: Complex nested structure, CSS selectors don't work reliably
- **Solution**: Use XPath provided by Playwright Codegen

### 4. **Multi-Tab Handling**
- **Issue**: Preview opens in new tab/window
- **Solution**: Use `context.waitForEvent('page')` with Promise.all()

---

## 🎯 Best Practices Followed

1. ✅ **Use semantic selectors** (`getByRole`, `getByLabel`) over CSS/XPath when possible
2. ✅ **Add console.log statements** for debugging and progress tracking
3. ✅ **Take screenshots** at key validation points
4. ✅ **Use explicit waits** with `waitForTimeout` after interactions
5. ✅ **Validate before and after states** (especially for drag & drop)
6. ✅ **Handle accessibility duplicates** with `.first()` or specific roles
7. ✅ **Use dynamic locators** instead of hardcoded indices when possible

---

## 📊 Test Coverage Summary

| Feature | Status | Test File |
|---------|--------|-----------|
| Quiz Creation | ✅ | matching-quiz-creation.spec.js |
| Edit Pairs | ✅ | matching-quiz-crud.spec.js |
| Copy Quiz | ✅ | matching-quiz-crud.spec.js |
| Drag & Drop Reorder | ✅ | matching-quiz-reorder.spec.js |
| Minimum Pairs Validation | ✅ | matching-quiz-minimum-pairs.spec.js |
| Media Upload (Image/Video) | 🔄 | matching-quiz-media.spec.js |
| Frontend Display | ✅ | matching-quiz-frontend-validation.spec.js |
| Save Notification | ✅ | matching-quiz-frontend-validation.spec.js |
| Preview in New Tab | ✅ | matching-quiz-frontend-validation.spec.js |
| Start Quiz Button | ✅ | matching-quiz-frontend-validation.spec.js |
| Question Display | ✅ | matching-quiz-frontend-validation.spec.js |
| Pair Values Display | ✅ | matching-quiz-frontend-validation.spec.js |

**Legend**: ✅ Passing | 🔄 In Progress | ❌ Not Implemented

---

## 🐛 Debugging Tips

1. **Use Playwright Inspector**: Add `--debug` flag to pause execution
2. **Check Screenshots**: Generated in workspace root with descriptive names
3. **Review Console Logs**: Tests include detailed step-by-step logging
4. **Use Codegen**: `npx playwright codegen` to generate reliable locators
5. **Increase Timeouts**: If elements load slowly, increase `waitForTimeout` values

---

## 📅 Last Updated
November 3, 2025

## 👤 Maintained By
Automation Team - Creator LMS QA
