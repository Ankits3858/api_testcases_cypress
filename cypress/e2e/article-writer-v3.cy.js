/// <reference types="cypress" />
import { environments, getConfig, getDefaultQueryParams, getHeaders, makeRequest, testData } from '../support/utils';

describe('AI Article Writer v3 API Tests', () => {
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

    environments().forEach((env) => {
        describe(`${env.toUpperCase()} Environment`, () => {
            const config = getConfig(env);
            const queryParams = getDefaultQueryParams();
            const headers = getHeaders(config);

            const defaultPayload = {
                article_title: "The Future of Artificial Intelligence",
                article_intro: "Exploring the transformative impact of AI on various industries",
                article_sections: ["Current AI Applications", "Future Trends", "Ethical Considerations"]
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
                it('should successfully generate article with valid input', () => {
                    const apiUrl = `${config.baseUrl}/v2/business/content/ai-article-writer-v3`;
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
                        
                        const article = response.body[0];
                        expect(article).to.have.property('article_title').that.is.a('string');
                        expect(article).to.have.property('article_intro').that.is.a('string');
                        expect(article).to.have.property('article_sections').that.is.an('array');
                        expect(article).to.have.property('data').that.is.an('array');

                        // Validate data array structure
                        article.data.forEach(section => {
                            expect(section).to.have.property('title').that.is.a('string');
                            expect(section).to.have.property('content').that.is.a('string');
                        });
                    });
                });

                it('should handle special characters in input', () => {
                    const specialCharsPayload = {
                        article_title: "AI & ML: The Future!",
                        article_intro: "Let's explore the world of AI & ML!",
                        article_sections: ["Current & Future", "Pros & Cons"]
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3`,
                        headers,
                        queryParams,
                        body: specialCharsPayload
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.be.an('array');
                        expect(response.body).to.have.length(1);

                        const article = response.body[0];
                        expect(article).to.have.property('article_title');
                        expect(article).to.have.property('article_intro');
                        expect(article).to.have.property('article_sections');
                        expect(article).to.have.property('data');
                    });
                });

                it('should validate response time is within acceptable range', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3`,
                        headers,
                        queryParams,
                        body: defaultPayload
                    }).then((response) => {
                        expect(response.duration).to.be.lessThan(30000);
                        expect(response.status).to.eq(200);
                        expect(response.body).to.be.an('array');
                        expect(response.body).to.have.length(1);
                    });
                });
            });

            context('Negative Test Cases @negative', () => {
                it('should handle empty article title', () => {
                    const invalidPayload = {
                        ...defaultPayload,
                        article_title: ""
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3`,
                        headers,
                        queryParams,
                        body: invalidPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty article intro', () => {
                    const invalidPayload = {
                        ...defaultPayload,
                        article_intro: ""
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3`,
                        headers,
                        queryParams,
                        body: invalidPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty article sections', () => {
                    const invalidPayload = {
                        ...defaultPayload,
                        article_sections: []
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3`,
                        headers,
                        queryParams,
                        body: invalidPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle missing required fields', () => {
                    const { article_sections, ...invalidPayload } = defaultPayload;

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3`,
                        headers,
                        queryParams,
                        body: invalidPayload
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle extremely long title and intro', () => {
                    const invalidPayload = {
                        ...defaultPayload,
                        article_title: "A".repeat(10000),
                        article_intro: "B".repeat(10000)
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3`,
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
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3`,
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
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3`,
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