# 🧪 WordPress Plugin Automation Testing with Playwright for Creator LMS (JavaScript)

## Overview
This project automates end-to-end and functional tests for WordPress plugins using **Playwright** with **JavaScript**.  
It supports multiple environments (staging, production) and allows different credentials per team member.

---

## 🧰 Prerequisites
- Node.js ≥ 18
- Git
- Chrome or supported browsers

---

## 🚀 Setup Instructions

### 1️⃣ Clone and Install
```bash
cd "git automation js/creatorlms-automation-testing"
npm install
npx playwright install
```

### 2️⃣ Configure Environment
Copy `.env.sample` to `.env`:
```bash
cp .env.sample .env
```
Fill in your site URLs and credentials in the `.env` file.

### 3️⃣ Run Tests
| Command | Description |
|----------|--------------|
| `npm test` | Run all tests headlessly |
| `npm run test:headed` | Run with browser UI |
| `npm run test:ui` | Launch Playwright UI mode |
| `npm run test:staging` | Test using staging credentials |
| `npm run test:prod` | Test using production credentials |
| `npm run test:report` | Open HTML report |
| `npm run clean:reports` | Delete old test reports |
| `npm run test:debug` | Run tests in debug mode |

### 4️⃣ View Reports
```bash
npm run test:report
```

---

## 📂 Folder Structure

```
creatorlms-automation-testing/
├── tests/             # Test files (*.spec.js)
├── pages/             # Page Object Models (*.page.js)
├── utils/             # Helper functions (*.helper.js)
├── .env.sample        # Environment variables template
├── .env               # Your local environment (git ignored)
├── .gitignore
├── playwright.config.js
├── package.json
└── README.md
```

---

## 🔧 Project Structure

### Pages (Page Object Model)
- `pages/login.page.js` - Login page interactions
- `pages/course.page.js` - Course creation and management

### Utils (Helper Functions)
- `utils/env.helper.js` - Environment configuration management
- `utils/auth.helper.js` - Authentication helper functions
- `utils/course.helper.js` - Course data generators
- `utils/media.helper.js` - Media upload and management
- `utils/wordpress.helper.js` - WordPress admin utilities

### Tests
- Place your test files in the `tests/` folder
- Use `.spec.js` extension for test files
- Example: `tests/login.spec.js`, `tests/course-creation.spec.js`

---

## 📝 Writing Tests

Example test structure:

```javascript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { CoursePage } from '../pages/course.page.js';
import { AuthenticationHelper } from '../utils/auth.helper.js';
import { CourseDataGenerator } from '../utils/course.helper.js';

test.describe('Course Creation Tests', () => {
  test('should create a new course', async ({ page }) => {
    // Setup authentication
    const authHelper = new AuthenticationHelper(page);
    await authHelper.ensureAuthenticated();
    
    // Create course
    const coursePage = new CoursePage(page);
    const courseData = CourseDataGenerator.generateSimpleCourse();
    
    await coursePage.navigateToCreatorLMS();
    await coursePage.navigateToCourses();
    await coursePage.clickAddCourse();
    await coursePage.startFromScratch();
    
    await coursePage.createCourseWithDetails(courseData);
    
    // Add chapters and lessons
    for (let i = 0; i < courseData.chapters.length; i++) {
      await coursePage.createChapterWithLessons(courseData.chapters[i], i + 1);
    }
    
    // Publish
    await coursePage.publishCourse();
    await coursePage.verifyCourseInList(courseData.title);
  });
});
```

---

## 🧠 Notes for Team Members
- Keep `.env` private (never commit it)
- Use `npm run test:headed` for debugging
- Use `npm test` for CI/CD runs
- Check the HTML report after runs for detailed results
- All helper functions are in the `utils/` folder
- All page objects are in the `pages/` folder

---

## 🌍 Environment Variables

Create a `.env` file with the following structure:

```bash
ENVIRONMENT=staging

# Staging Environment
STAGING_URL=https://your-staging-site.com
STAGING_USERNAME=your_username
STAGING_PASSWORD=your_password

# Production Environment
PROD_URL=https://your-production-site.com
PROD_USERNAME=your_username
PROD_PASSWORD=your_password
```

---

## 🎯 Key Features

- ✅ JavaScript ES6+ modules
- ✅ Page Object Model pattern
- ✅ Reusable helper utilities
- ✅ Multiple environment support
- ✅ Comprehensive course creation workflows
- ✅ Authentication management
- ✅ Media upload handling
- ✅ HTML reports with screenshots and videos

---

## 🐛 Debugging

For debugging tests:
```bash
npm run test:debug
```

To run specific test files:
```bash
npx playwright test tests/your-test-file.spec.js --headed
```

---

Happy Testing! 🚀
