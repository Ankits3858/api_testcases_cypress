/// <reference types="cypress" />
import { environments, getConfig, getDefaultQueryParams, getHeaders, makeRequest } from '../support/utils';

describe('Article Rewriter API Tests', () => {
    // Log environment variables at the start
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
                ...getDefaultQueryParams(),
                engine: 'premium',
                num_copies: '1'
            };
            const headers = getHeaders(config);

            const defaultPayload = {
                link: "https://www.bleepingcomputer.com/news/security/suncor-energy-cyberattack-impacts-petro-canada-gas-stations/"
            };

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
                it('should successfully rewrite article with valid link', () => {
                    const apiUrl = `${config.baseUrl}/v2/business/content/article-rewriter`;
                    
                    makeRequest({
                        method: 'POST',
                        url: apiUrl,
                        headers,
                        queryParams,
                        body: defaultPayload,
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
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/article-rewriter`,
                        headers,
                        queryParams,
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.duration).to.be.lessThan(30000);
                        expect(response.status).to.eq(200);
                    });
                });
            });

            context('Negative Test Cases @negative', () => {
                it('should handle empty link', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/article-rewriter`,
                        headers,
                        queryParams,
                        body: { ...defaultPayload, link: '' },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(422);
                    });
                });

                it('should handle invalid link format', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/article-rewriter`,
                        headers,
                        queryParams,
                        body: { link: "not-a-valid-url" },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle missing link field', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/article-rewriter`,
                        headers,
                        queryParams,
                        body: {},
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle invalid engine parameter', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/article-rewriter`,
                        headers,
                        queryParams: { ...queryParams, engine: 'invalid' },
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(422);
                    });
                });

                it('should handle invalid num_copies parameter', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/article-rewriter`,
                        headers,
                        queryParams: { ...queryParams, num_copies: 'invalid' },
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(422);
                    });
                });

                it('should handle invalid authentication', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/article-rewriter`,
                        headers: { ...headers, 'X-API-KEY': 'invalid-key' },
                        queryParams,
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(401);
                    });
                });
            });
        });
    });
}); 