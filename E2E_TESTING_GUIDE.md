# E2E Testing Guide - Quick Start

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd car-showroom-client
npm install
```

This installs all required testing dependencies:
- `jest` - Test runner
- `@testing-library/react` - React testing utilities
- `@testing-library/user-event` - User interaction simulation
- `axios-mock-adapter` - HTTP mocking
- `ts-jest` - TypeScript support

### 2. Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run all tests (including unit tests if any)
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### 3. View Results

Tests will output to the console with pass/fail status. Coverage reports are generated in `coverage/` directory.

---

## 📋 What's Tested

### Authentication Flows (32 tests)

✅ **User Registration**
- Successful registration with CUSTOMER, STAFF, and MANAGER roles
- Password mismatch validation
- Terms acceptance validation
- Duplicate email handling (409 error)

✅ **User Login**
- Successful login with all three roles
- Wrong password handling (401 error, inline error display)
- Wrong role handling (401 error)
- Server error handling (500 error)
- Loading state during authentication

✅ **Role-Based Access Control**
- Unauthenticated users redirected to /login
- Wrong-role users redirected to correct home

✅ **Session Persistence**
- User session persists across page refreshes
- Clearing user data removes localStorage entry

✅ **Password Security**
- Password sent to backend but never returned in response
- Password never stored in localStorage

✅ **Input Validation**
- Email format validation
- Required field validation

### Context State Management (12 tests)

✅ **Initialization**
- Context initializes with null values
- Context rehydrates from localStorage
- Handles corrupted localStorage data

✅ **State Management**
- setUser updates context state
- clearUser resets context

✅ **LocalStorage Sync**
- setUser persists to localStorage
- clearUser removes from localStorage
- Automatic synchronization

✅ **Role Handling**
- Correctly handles CUSTOMER, STAFF, and MANAGER roles

✅ **Error Handling**
- useApp throws error when used outside AppProvider

---

## 🛠️ Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests once |
| `npm run test:e2e` | Run only E2E tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e:ci` | Run E2E tests in CI mode (no watch, with coverage) |

### Advanced Commands

```bash
# Run a specific test file
npm test -- auth.e2e.test.tsx

# Run tests matching a pattern
npm test -- -t "login"

# Run tests with verbose output
npm test -- --verbose

# Update snapshots (if using snapshot tests)
npm test -- -u

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 📊 Coverage Reports

After running `npm run test:coverage`, coverage reports are generated in:

```
coverage/
├── lcov-report/
│   └── index.html          # Open this in a browser
├── lcov.info               # LCOV format (for CI tools)
└── coverage-final.json     # JSON format
```

**View HTML report**:
```bash
open coverage/lcov-report/index.html
# or
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html     # Windows
```

---

## 🐛 Debugging Failed Tests

### 1. Read the Error Message

Jest provides detailed error messages. Look for:
- **Expected vs Received**: What the test expected vs what it got
- **Stack Trace**: Where the error occurred
- **Diff**: Visual comparison of expected and actual values

### 2. Run a Single Test

```bash
npm test -- -t "AC1: Successful registration"
```

### 3. Use `screen.debug()`

Add to your test to see the rendered HTML:

```typescript
import { screen } from '@testing-library/react';

test('my test', () =&gt; {
  renderWithRouter(&lt;MyComponent /&gt;);
  screen.debug(); // Prints entire DOM
  screen.debug(screen.getByRole('button')); // Prints specific element
});
```

### 4. Check Mock History

```typescript
console.log(mock.history.post); // See all POST requests
console.log(mock.history.get);  // See all GET requests
```

### 5. Inspect LocalStorage

```typescript
console.log(localStorage.getItem('user'));
```

### 6. Common Issues

#### "Cannot find module"
```bash
npm install
```

#### "localStorage is not defined"
Check that `src/tests/setup.ts` is configured in `package.json`:
```json
"jest": {
  "setupFilesAfterEnv": ["&lt;rootDir&gt;/src/tests/setup.ts"]
}
```

#### "Element not found"
Use `screen.debug()` to see what's actually rendered. Check:
- Is the component rendered?
- Is the element visible?
- Are you using the correct query (getByRole, getByLabelText, etc.)?

#### "Timeout waiting for element"
Increase timeout or check if async operation completed:
```typescript
await waitFor(() =&gt; {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
}, { timeout: 5000 });
```

---

## 📝 Test File Structure

```
car-showroom-client/
├── src/
│   ├── tests/
│   │   ├── e2e/
│   │   │   ├── auth.e2e.test.tsx         # 32 authentication tests
│   │   │   └── context.e2e.test.tsx      # 12 context tests
│   │   ├── __mocks__/
│   │   │   └── styleMock.ts              # CSS mock
│   │   └── setup.ts                      # Global setup
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── ...
├── package.json
├── E2E_TEST_DOCUMENTATION.md     # Detailed documentation
└── E2E_TESTING_GUIDE.md          # This file (quick start)
```

---

## 🔄 CI/CD Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        working-directory: car-showroom-client
        run: npm ci
      - name: Run E2E tests
        working-directory: car-showroom-client
        run: npm run test:e2e:ci
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./car-showroom-client/coverage/lcov.info
```

### GitLab CI

Add to `.gitlab-ci.yml`:

```yaml
e2e-tests:
  stage: test
  image: node:18
  script:
    - cd car-showroom-client
    - npm ci
    - npm run test:e2e:ci
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: car-showroom-client/coverage/cobertura-coverage.xml
```

---

## ✅ Acceptance Criteria Checklist

### Backend (Tested via Mocks)

- [x] POST /api/users creates user with BCrypt-hashed password
- [x] Role defaults to CUSTOMER if not provided
- [x] POST /api/auth/login validates credentials and role
- [x] Returns user data on success, 401 on failure
- [x] Password is hashed before persistence
- [x] Plaintext password logic removed

### Frontend (Directly Tested)

- [x] /signup submits to API and redirects to role-appropriate home
- [x] /login submits to API with inline error handling (no redirect on failure)
- [x] ProtectedRoute redirects based on authentication and role
- [x] All protected routes wrapped with ProtectedRoute
- [x] Logout clears context and redirects to /
- [x] AppContext persists to localStorage

### Bug Fixes (Verified)

- [x] Failed login shows inline error (no redirect to signup)
- [x] Signup routes based on actual role from API response

---

## 📚 Additional Resources

- **Full Documentation**: See `E2E_TEST_DOCUMENTATION.md`
- **Jest Docs**: https://jestjs.io/docs/getting-started
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **User Event**: https://testing-library.com/docs/user-event/intro

---

## 👥 Support

For questions or issues:
- Check `E2E_TEST_DOCUMENTATION.md` for detailed information
- Review test files for examples
- Contact the development team

---

**Happy Testing! 🎉**
