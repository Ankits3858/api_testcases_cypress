/// <reference types="cypress" />
import { environments, getConfig, getDefaultQueryParams, getHeaders, makeRequest } from '../support/utils';

describe('Blog Outlines API Tests', () => {
    // Log environment variables at the start
    before(() => {
        cy.log('Environment Variables Check:');
        cy.log('Current Test Environment:', Cypress.env('TEST_ENV') || 'all');
        cy.log('STAGING_BASE_URL:', Cypress.env('STAGING_BASE_URL'));
        cy.log('STAGING_X_API_KEY:', Cypress.env('STAGING_X_API_KEY'));
        cy.log('PROD_BASE_URL:', Cypress.env('PROD_BASE_URL'));
        cy.log('PROD_X_API_KEY:', Cypress.env('PROD_X_API_KEY'));
        cy.log('ENGINE:', Cypress.env('ENGINE'));
        cy.log('LANGUAGE:', Cypress.env('LANGUAGE'));
    });

    // Call environments() as a function to get the array of environments to test
    environments().forEach((env) => {
        describe(`${env.toUpperCase()} Environment`, () => {
            const config = getConfig(env);
            const queryParams = getDefaultQueryParams();
            const headers = getHeaders(config);

            const defaultPayload = {
                blog_title: "How Artificial Intelligence Will Change The World Of Copywriting",
                blog_intro: "The possibilities of artificial intelligence (AI) seem endless. It's predicted that AI will soon have the ability to write articles, screen movies, and even drive cars on our behalf. But what about copywriting? Can AI be the next copywriter? I've spent the past few weeks doing some research and experimenting, and I've come up with a few ideas for how AI will change the world of copywriting."
            };

            beforeEach(() => {
                // Log detailed configuration for each test
                cy.log('Test Configuration:');
                cy.log('Environment:', env);
                cy.log('Base URL:', config.baseUrl);
                cy.log('API Key:', config.apiKey ? 'Present' : 'Missing');
                cy.log('Token:', config.token ? 'Present' : 'Missing');
                cy.log('Query Parameters:', JSON.stringify(queryParams));
                cy.log('Headers:', JSON.stringify({
                    ...headers,
                    'X-API-KEY': headers['X-API-KEY'] ? 'Present' : 'Missing',
                    'Authorization': headers['Authorization'] ? 'Present' : 'Missing'
                }));
                
                cy.wrap(config).as('config');
            });

            context('Positive Test Cases @positive', () => {
                it('should successfully generate blog outline with valid input', () => {
                    const apiUrl = `${config.baseUrl}/v2/business/content/blog-outlines`;
                    cy.log('Full Request Details:');
                    cy.log('URL:', apiUrl);
                    cy.log('Method: POST');
                    cy.log('Headers:', JSON.stringify(headers, null, 2));
                    cy.log('Query Params:', JSON.stringify(queryParams, null, 2));
                    cy.log('Payload:', JSON.stringify(defaultPayload, null, 2));

                    makeRequest({
                        method: 'POST',
                        url: apiUrl,
                        headers,
                        queryParams,
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        // Log response details
                        cy.log('Response Status:', response.status);
                        cy.log('Response Headers:', JSON.stringify(response.headers, null, 2));
                        cy.log('Response Body:', JSON.stringify(response.body, null, 2));

                        expect(response.status).to.eq(200);
                        expect(response.body).to.not.be.null;
                        expect(response.headers['content-type']).to.include('application/json');

                        // Validate the response structure
                        expect(response.body).to.be.an('array');
                        expect(response.body).to.have.length(1);

                        const outline = response.body[0];
                        expect(outline).to.have.property('text').that.is.a('string');
                        expect(outline.text).to.include('TITLE:');
                        expect(outline.text).to.include('BLOG OUTLINE:');
                        expect(outline.text.length).to.be.greaterThan(0);

                        // Validate the outline structure
                        const outlineText = outline.text;
                        expect(outlineText).to.match(/TITLE:.*\nBLOG OUTLINE:/);
                        expect(outlineText.split('\n').length).to.be.greaterThan(2); // At least title, outline header, and one section
                    });
                });

                it('should handle special characters in input', () => {
                    const specialCharsPayload = {
                        blog_title: "AI & Business: A Perfect Match!",
                        blog_intro: "Let's explore how AI & ML are changing business landscape! This comprehensive guide will show you the future of business automation.",
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-outlines`,
                        headers,
                        queryParams,
                        body: specialCharsPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.be.an('array');
                        expect(response.body).to.have.length(1);
                        
                        const outline = response.body[0];
                        expect(outline).to.have.property('text').that.is.a('string');
                        expect(outline.text).to.include('TITLE:');
                        expect(outline.text).to.include('BLOG OUTLINE:');
                    });
                });

                it('should validate response time is within acceptable range', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-outlines`,
                        headers,
                        queryParams,
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.duration).to.be.lessThan(30000);
                        expect(response.status).to.eq(200);
                        expect(response.body).to.be.an('array');
                        expect(response.body).to.have.length(1);
                        expect(response.body[0]).to.have.property('text').that.is.a('string');
                        expect(response.body[0].text).to.include('TITLE:');
                        expect(response.body[0].text).to.include('BLOG OUTLINE:');
                    });
                });
            });

            context('Negative Test Cases @negative', () => {
                it('should handle empty blog title', () => {
                    const invalidPayload = {
                        ...defaultPayload,
                        blog_title: ""
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-outlines`,
                        headers,
                        queryParams,
                        body: invalidPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty blog description', () => {
                    const invalidPayload = {
                        ...defaultPayload,
                        blog_intro: ""
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-outlines`,
                        headers,
                        queryParams,
                        body: invalidPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle missing required fields', () => {
                    const { blog_intro, ...invalidPayload } = defaultPayload;

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-outlines`,
                        headers,
                        queryParams,
                        body: invalidPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle extremely long inputs', () => {
                    const invalidPayload = {
                        ...defaultPayload,
                        blog_title: "A".repeat(10000),
                        blog_intro: "B".repeat(10000)
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-outlines`,
                        headers,
                        queryParams,
                        body: invalidPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle invalid authentication', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-outlines`,
                        headers: { ...headers, 'X-API-KEY': 'invalid-api-key' },
                        queryParams,
                        body: defaultPayload
                    }).then((response) => {
                        expect(response.status).to.eq(401);
                    });
                });

                it('should handle invalid query parameters', () => {
                    const invalidQueryParams = {
                        ...queryParams,
                        engine: 'invalid_engine',
                        language: 'invalid_lang'
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-outlines`,
                        headers,
                        queryParams: invalidQueryParams,
                        body: defaultPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });
            });
        });
    });
}); 