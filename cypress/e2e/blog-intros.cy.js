/// <reference types="cypress" />
import { environments, getConfig, getDefaultQueryParams, getHeaders, makeRequest } from '../support/utils';

describe('Blog Intros API Tests', () => {
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
                blog_title: "The Impact of Artificial Intelligence on Modern Business",
                blog_description: "Exploring how AI is transforming various business sectors and operations",
                tone_of_voice: "Professional"
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
                it('should successfully generate blog intro with valid input', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-intros`,
                        headers,
                        queryParams,
                        body: defaultPayload
                    }).then((response) => {
                        cy.log(JSON.stringify(response.body));
                        expect(response.status).to.eq(200);
                        expect(response.body).to.not.be.null;
                        expect(response.headers['content-type']).to.include('application/json');
                        
                        // Validate the response structure for LLM-generated content
                        expect(response.body).to.be.an('array');
                        response.body.forEach(item => {
                            expect(item).to.have.property('text').that.is.a('string');
                            expect(item.text.length).to.be.greaterThan(0);
                        });
                    });
                });

                it('should handle special characters in input', () => {
                    const specialCharsPayload = {
                        blog_title: "AI & ML: Transforming Business!",
                        blog_description: "Let's explore the impact of AI & ML on modern business operations!",
                        tone_of_voice: "Professional & Engaging"
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-intros`,
                        headers,
                        queryParams,
                        body: specialCharsPayload
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.be.an('array');
                        response.body.forEach(item => {
                            expect(item).to.have.property('text').that.is.a('string');
                        });
                    });
                });

                it('should validate response time is within acceptable range', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-intros`,
                        headers,
                        queryParams,
                        body: defaultPayload
                    }).then((response) => {
                        expect(response.duration).to.be.lessThan(30000);
                        expect(response.status).to.eq(200);
                        expect(response.body).to.be.an('array');
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
                        url: `${config.baseUrl}/v2/business/content/blog-intros`,
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
                        blog_description: ""
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-intros`,
                        headers,
                        queryParams,
                        body: invalidPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle missing required fields', () => {
                    const { blog_description, ...invalidPayload } = defaultPayload;

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-intros`,
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
                        blog_description: "B".repeat(10000)
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-intros`,
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
                        url: `${config.baseUrl}/v2/business/content/blog-intros`,
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
                        url: `${config.baseUrl}/v2/business/content/blog-intros`,
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