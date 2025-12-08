# CLMS-Automation

## Overview
This project automates end-to-end and functional tests for WordPress plugins using **Playwright**.  
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
git clone https://github.com/CODEREXLTD/creatorlms-automation-testing.git
cd creatorlms-automation-testing
npm install
```

### 2️⃣ Configure Environment
Copy `.env.sample` to `.env`:
```bash
cp .env.sample .env
```
Fill in your site URLs and credentials.

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

### 4️⃣ View Reports
```bash
npm run test:report
```

---

## 📂 Folder Structure

```
creatorlms-automation-testing/
├── tests/             # test files
├── pages/             # page objects
├── utils/             # helpers
├── .env.sample
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 🧠 Notes for Team Members
- Keep `.env` private (never commit it).
- Use `npm run test:headed` for debugging.
- Use `npm test` for CI/CD runs.
- Check the HTML report after runs for detailed results.

---

Happy Testing! 🚀
