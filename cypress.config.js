const { defineConfig } = require('cypress');
const fs = require('fs');
require('dotenv').config();

module.exports = defineConfig({
  watchForFileChanges: false,
  video: true, // Enable video recording
  videoUploadOnPasses: false, // Don't upload videos for passing tests
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
  },
  e2e: {
    defaultCommandTimeout: 30000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    reporter: 'cypress-mochawesome-reporter',
    video: false,
    screenshotsFolder: 'images',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'API Tests Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
    retries: {
      runMode: 2, // Retry up to 2 times in `cypress run`
      openMode: 3, // Retry up to 2 times in `cypress open`
    },
    setupNodeEvents(on, config) {
      // Implement event listeners here

      // Event listener for deleting videos of passing tests
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          const videoPath = results.video;
          if (results.stats.failures === 0) {
            // Delete the video if there are no failures
            fs.unlink(videoPath, (err) => {
              if (err) {
                console.error('Failed to delete video:', err);
              } else {
                console.log('Deleted video:', videoPath);
              }
            });
          }
        }
      });

      // Event listener for deleting screenshots of passing tests
      on('after:screenshot', (details) => {
        if (!details.testFailure) {
          // Delete the screenshot if the test didn't fail
          fs.unlink(details.path, (err) => {
            if (err) {
              console.error('Failed to delete screenshot:', err);
            } else {
              console.log('Deleted screenshot:', details.path);
            }
          });
        }
      });

      // Custom Chrome Profile Integration
    
      // Attach cypress-mochawesome-reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);

      // Get environment from command line args or use default
      const testEnv = process.env.TEST_ENV || config.env.TEST_ENV;
      if (testEnv && ['staging', 'production'].includes(testEnv)) {
        config.env.TEST_ENV = testEnv;
      }

      // Production Environment
      config.env.PROD_X_API_KEY = process.env.PROD_X_API_KEY;
      config.env.PROD_BASE_URL = process.env.PROD_BASE_URL;
      config.env.PROD_TOKEN = process.env.PROD_TOKEN;

      // Staging Environment
      config.env.STAGING_X_API_KEY = process.env.STAGING_X_API_KEY;
      config.env.STAGING_BASE_URL = process.env.STAGING_BASE_URL;
      config.env.STAGING_TOKEN = process.env.STAGING_TOKEN;

      // Common Settings
      config.env.ENGINE = process.env.ENGINE;
      config.env.LANGUAGE = process.env.LANGUAGE;
      config.env.NUM_COPIES = process.env.NUM_COPIES;

      // Skip base URL verification since we're testing an API
      config.env.experimentalModifyObstructiveThirdPartyCode = true;
      config.env.experimentalSourceRewriting = true;
      // Don't fail on status codes since we're testing API responses
      config.env.failOnStatusCode = false;

      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
  },
  env: {
    grepTags: true,
    grepFilterSpecs: true,
    production: 'https://app.writesonic.com/login',
    // Environment selection
    TEST_ENV: process.env.TEST_ENV || 'all',
    // Production Environment
    PROD_X_API_KEY: process.env.PROD_X_API_KEY,
    PROD_BASE_URL: process.env.PROD_BASE_URL,
    PROD_TOKEN: process.env.PROD_TOKEN,
    // Staging Environment
    STAGING_X_API_KEY: process.env.STAGING_X_API_KEY,
    STAGING_BASE_URL: process.env.STAGING_BASE_URL,
    STAGING_TOKEN: process.env.STAGING_TOKEN,
    // Common Settings
    ENGINE: process.env.ENGINE,
    LANGUAGE: process.env.LANGUAGE,
    NUM_COPIES: process.env.NUM_COPIES
  },
  // Add the following options to manage memory usage
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 5,
});
//https://staging.writesonic.com/login
//'https://app.writesonic.com/login'