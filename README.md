# WriteSonic API Test Suite

This project contains automated tests for the WriteSonic API endpoints.

## Setup Instructions

1. Create a `cypress.env.json` file in the project root with your API keys:

```json
{
  "STAGING_BASE_URL": "https://staging-azure-api.writesonic.com",
  "STAGING_X_API_KEY": "your_staging_api_key_here",
  "PROD_BASE_URL": "https://api.writesonic.com", 
  "PROD_X_API_KEY": "your_prod_api_key_here",
  "ENGINE": "premium",
  "LANGUAGE": "en",
  "NUM_COPIES": 1,
  "TEST_ENV": "staging"
}
```

2. Replace `your_staging_api_key_here` and `your_prod_api_key_here` with your actual API keys.

3. Install dependencies:

```bash
npm install
```

## Running Tests

Run all tests:

```bash
npx cypress run
```

Run a specific test:

```bash
npx cypress run --spec "cypress/e2e/define-this.cy.js"
```

Run tests for a specific environment:

```bash
npx cypress run --env TEST_ENV=staging
```

## Troubleshooting

If you encounter connection issues:

1. Verify your API keys are correct in `cypress.env.json`
2. Make sure you're using the correct base URLs for your environment
3. Check your internet connection
4. Run the diagnostics test: `npx cypress run --spec "cypress/e2e/api-diagnostics.cy.js"`

## Common Issues

### 401 Unauthorized Errors
- This typically means your API key is invalid or expired
- Update your API key in the `cypress.env.json` file

### 403 Insufficient Balance Errors
- This means your account doesn't have enough credits
- Upgrade your plan or add more credits to your account

### Cannot Connect to Server Errors
- Check your internet connection
- Verify the base URLs are correct for your environment

## 🚀 Features

- **Multi-environment Testing**: Supports both staging and production environments
- **Comprehensive Test Coverage**: Tests for multiple API endpoints including:
  - Article Writer 3 SSE
  - Amazon Product Descriptions
  - Startup Ideas
  - Story Generation
  - Text Summary
  - Tone Changer
  - Make Your Own AI
  - Photosonic
- **Detailed Validation**: Tests for:
  - Response format
  - Response time
  - Error handling
  - Authentication
  - Required parameters
- **Interactive Test Reports**: Beautiful test execution reports
- **Environment Configuration**: Easy setup for different environments

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Cypress (v10 or higher)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd writesonic-api-tests
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
TEST_ENV=all  # or 'staging' or 'prod'
STAGING_BASE_URL=your_staging_url
STAGING_X_API_KEY=your_staging_api_key
PROD_BASE_URL=your_production_url
PROD_X_API_KEY=your_production_api_key
```

## 🏃‍♂️ Running Tests

### Run all tests
```bash
npm run test
```

### Run tests for specific environment
```bash
npm run test:staging  # for staging environment
npm run test:prod    # for production environment
```

### Run specific test file
```bash
npm run test:file -- --spec "cypress/e2e/amazon-product-descriptions.cy.js"
```

### Run tests with specific tags
```bash
npm run test:tag -- --grep "@positive"  # run only positive test cases
npm run test:tag -- --grep "@negative"  # run only negative test cases
```

## 📁 Project Structure

```
writesonic-api-tests/
├── cypress/
│   ├── e2e/
│   │   ├── ai-article-writer-v3.cy.js
│   │   ├── amazon-product-descriptions.cy.js
│   │   ├── startup-ideas.cy.js
│   │   ├── story-generation.cy.js
│   │   ├── summary.cy.js
│   │   ├── tone-changer.cy.js
│   │   ├── command.cy.js
│   │   └── generate-image.cy.js
│   └── support/
│       └── utils.js
├── .env
├── cypress.config.js
├── package.json
└── README.md
```

## 🔍 Test Cases

Each endpoint test file includes:

### Positive Test Cases
- Successful API response
- Response format validation
- Response time validation
- Content validation

### Negative Test Cases
- Empty required fields
- Invalid authentication
- Missing parameters
- Invalid parameter values

## 📊 Test Reports

After test execution, you can find the test reports in:
- `cypress/reports/` - HTML reports
- `cypress/videos/` - Test execution videos
- `cypress/screenshots/` - Screenshots of failed tests

## 🔧 Configuration

### Environment Configuration
The test suite supports three environment modes:
- `all`: Runs tests on both staging and production
- `staging`: Runs tests only on staging environment
- `prod`: Runs tests only on production environment

### Test Configuration
Each test file includes:
- Environment variable checks
- Default payload configuration
- Query parameter validation
- Response validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please contact the QA team or create an issue in the repository.

---

Made with ❤️ by the Writesonic QA Team 