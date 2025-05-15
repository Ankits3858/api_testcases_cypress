/// <reference types="cypress" />
import { environments, getConfig, getDefaultQueryParams, getHeaders, makeRequest } from '../support/utils';

describe('Article Writer 3 SSE API Tests', () => {
    before(() => {
        cy.log('Environment Variables Check:');
        cy.log('Current Test Environment:', Cypress.env('TEST_ENV') || 'all');
        cy.log('STAGING_BASE_URL:', Cypress.env('STAGING_BASE_URL'));
        cy.log('STAGING_X_API_KEY:', Cypress.env('STAGING_X_API_KEY'));
        cy.log('PROD_BASE_URL:', Cypress.env('PROD_BASE_URL'));
        cy.log('PROD_X_API_KEY:', Cypress.env('PROD_X_API_KEY'));
    });

    environments().forEach((env) => {
        describe(`${env.toUpperCase()} Environment`, () => {
            const config = getConfig(env);
            const queryParams = { 
                engine: 'premium',
                language: 'en',
                data: JSON.stringify({
                    article_title: "AI in copywriting",
                    article_intro: "AI stands for Artificial Intelligence",
                    article_sections: ["Introduction to AI", "Advantages of AI"]
                })
            };
            const headers = getHeaders(config);

            beforeEach(() => {
                cy.log('Test Configuration:', {
                    environment: env,
                    baseUrl: config.baseUrl,
                    queryParams,
                    headers: {
                        ...headers,
                        'X-API-KEY': headers['X-API-KEY'] ? 'Present' : 'Missing'
                    }
                });
            });

            context('Positive Test Cases @positive', () => {
                it('should successfully generate article with valid input', () => {
                    const apiUrl = `${config.baseUrl}/v2/business/content/ai-article-writer-v3/sse`;
                    
                    makeRequest({
                        method: 'GET',
                        url: apiUrl,
                        headers,
                        queryParams,
                        failOnStatusCode: false
                    }).then((response) => {
                        cy.log('Response:', response);
                        
                        expect(response.status).to.eq(200);
                        expect(response.body).to.be.an('array');
                        expect(response.body[0]).to.have.property('text').that.is.a('string');
                        expect(response.body[0].text.length).to.be.greaterThan(0);
                    });
                });

                it('should validate response time is within acceptable range', () => {
                    makeRequest({
                        method: 'GET',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3/sse`,
                        headers,
                        queryParams,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.duration).to.be.lessThan(30000);
                        expect(response.status).to.eq(200);
                    });
                });
            });

            context('Negative Test Cases @negative', () => {
                it('should handle empty article_title in data', () => {
                    const invalidQueryParams = {
                        ...queryParams,
                        data: JSON.stringify({
                            ...JSON.parse(queryParams.data),
                            article_title: ""
                        })
                    };

                    makeRequest({
                        method: 'GET',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3/sse`,
                        headers,
                        queryParams: invalidQueryParams,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty article_intro in data', () => {
                    const invalidQueryParams = {
                        ...queryParams,
                        data: JSON.stringify({
                            ...JSON.parse(queryParams.data),
                            article_intro: ""
                        })
                    };

                    makeRequest({
                        method: 'GET',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3/sse`,
                        headers,
                        queryParams: invalidQueryParams,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty article_sections in data', () => {
                    const invalidQueryParams = {
                        ...queryParams,
                        data: JSON.stringify({
                            ...JSON.parse(queryParams.data),
                            article_sections: []
                        })
                    };

                    makeRequest({
                        method: 'GET',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3/sse`,
                        headers,
                        queryParams: invalidQueryParams,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty engine parameter', () => {
                    makeRequest({
                        method: 'GET',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3/sse`,
                        headers,
                        queryParams: { ...queryParams, engine: '' },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty language parameter', () => {
                    makeRequest({
                        method: 'GET',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3/sse`,
                        headers,
                        queryParams: { ...queryParams, language: '' },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle invalid authentication', () => {
                    makeRequest({
                        method: 'GET',
                        url: `${config.baseUrl}/v2/business/content/ai-article-writer-v3/sse`,
                        headers: { ...headers, 'X-API-KEY': 'invalid-key' },
                        queryParams,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(401);
                    });
                });
            });
        });
    });
}); 