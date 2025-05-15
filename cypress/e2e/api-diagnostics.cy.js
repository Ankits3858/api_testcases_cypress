/// <reference types="cypress" />

describe('API Diagnostics', () => {
  it('should log environment variables and test direct API access', () => {
    // Log all environment variables
    cy.log('Environment Variables:', {
      STAGING_BASE_URL: Cypress.env('STAGING_BASE_URL'),
      STAGING_X_API_KEY: Cypress.env('STAGING_X_API_KEY') ? 'Present (first 5 chars): ' + Cypress.env('STAGING_X_API_KEY').substring(0, 5) : 'Missing',
      PROD_BASE_URL: Cypress.env('PROD_BASE_URL'),
      PROD_X_API_KEY: Cypress.env('PROD_X_API_KEY') ? 'Present (first 5 chars): ' + Cypress.env('PROD_X_API_KEY').substring(0, 5) : 'Missing',
      ENGINE: Cypress.env('ENGINE'),
      LANGUAGE: Cypress.env('LANGUAGE'),
      NUM_COPIES: Cypress.env('NUM_COPIES'),
      TEST_ENV: Cypress.env('TEST_ENV')
    });

    // Test raw fetch to Cypress itself (should work)
    cy.log('Testing connection to cypress.io:');
    cy.request({
      url: 'https://www.cypress.io/',
      failOnStatusCode: false
    }).then(response => {
      cy.log('Cypress.io Response:', { status: response.status });
      expect(response.status).to.eq(200);
    });

    // Try multiple possible base URLs
    const possibleUrls = [
      'https://staging-azure-api.writesonic.com',
      'https://api.staging.writesonic.com',
      'https://api.writesonic.com',
    ];

    // Test each URL with a simple HEAD request
    possibleUrls.forEach(url => {
      cy.log(`Testing connection to ${url}`);
      cy.request({
        url: url,
        method: 'HEAD',
        failOnStatusCode: false,
        timeout: 10000
      }).then(response => {
        cy.log(`Response from ${url}:`, { 
          status: response.status,
          statusText: response.statusText
        });
      });
    });
  });
}); 