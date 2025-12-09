# Project Structure

This document describes the structure of the JavaScript-based Playwright automation project.

## Directory Layout

```
creatorlms-automation-testing/
│
├── pages/                          # Page Object Models
│   ├── login.page.js              # Login page actions and selectors
│   └── course.page.js             # Course page actions and selectors
│
├── utils/                          # Helper utilities
│   ├── env.helper.js              # Environment configuration
│   ├── auth.helper.js             # Authentication helpers
│   ├── course.helper.js           # Course data generators
│   ├── media.helper.js            # Media handling utilities
│   └── wordpress.helper.js        # WordPress utilities
│
├── tests/                          # Test specifications
│   └── *.spec.js                  # Test files
│
├── playwright-report/              # Generated HTML reports
├── test-results/                   # Test execution artifacts
│
├── .env.sample                     # Environment template
├── .env                           # Local environment (git ignored)
├── .gitignore                     # Git ignore rules
├── playwright.config.js           # Playwright configuration
├── package.json                   # Project dependencies
└── README.md                      # Project documentation
```

## Key Differences from TypeScript Version

1. **File Extensions**: All files use `.js` instead of `.ts`
2. **No Type Annotations**: JavaScript doesn't require type definitions
3. **ES6 Modules**: Uses `import/export` syntax
4. **Constructor Syntax**: Uses `constructor(page) { this.page = page; }`
5. **Package.json**: Includes `"type": "module"` for ES6 support

## Module System

This project uses ES6 modules:
- Use `import` for dependencies
- Use `export` for classes and functions
- File extensions (`.js`) are required in import paths

Example:
```javascript
import { LoginPage } from '../pages/login.page.js';
import { getEnv } from '../utils/env.helper.js';
```

## Class Structure

### Page Objects
Page objects encapsulate page interactions:
```javascript
export class PageName {
  constructor(page) {
    this.page = page;
  }
  
  async methodName() {
    // Implementation
  }
}
```

### Helper Classes
Utility classes provide reusable functions:
```javascript
export class HelperName {
  static async helperMethod() {
    // Implementation
  }
}
```

## Best Practices

1. **Page Objects**: Keep page-specific logic in page classes
2. **Helpers**: Place reusable logic in utility files
3. **Tests**: Keep tests focused and readable
4. **Naming**: Use descriptive names for files and functions
5. **Imports**: Always include `.js` extension in import paths
