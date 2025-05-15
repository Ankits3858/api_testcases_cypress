/// <reference types="cypress" />
import { environments, getConfig, getDefaultQueryParams, getHeaders, makeRequest } from '../support/utils';

describe('Blog Ideas API Tests', () => {
    let config;
    let defaultParams;

    before(() => {
        const env = Cypress.env('TEST_ENV') || 'staging';
        config = getConfig(env);
        defaultParams = getDefaultQueryParams();
        cy.log('Environment:', env);
        cy.log('Test Configuration:', config);
        cy.log('Default Parameters:', defaultParams);
    });

    context('Positive Tests', () => {
        it('should generate blog ideas with valid parameters', () => {
            const payload = {
                topic: 'artificial intelligence',
                primary_keyword: 'AI'
            };

            cy.then(() => {
                makeRequest({
                    method: 'POST',
                    url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                    headers: {
                        'X-API-KEY': config.apiKey,
                        'Authorization': config.token,
                        'Content-Type': 'application/json'
                    },
                    queryParams: defaultParams,
                    body: payload,
                    failOnStatusCode: false
                }).then((response) => {
                    cy.log('Response:', response);
                    expect(response.status).to.equal(200);
                    expect(response.body).to.be.an('array');
                    expect(response.duration).to.be.lessThan(30000);
                });
            });
        });
    });

    context('Negative Tests', () => {
        it('should handle empty topic', () => {
            const payload = {
                topic: '',
                primary_keyword: 'AI'
            };

            cy.then(() => {
                makeRequest({
                    method: 'POST',
                    url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                    headers: {
                        'X-API-KEY': config.apiKey,
                        'Authorization': config.token,
                        'Content-Type': 'application/json'
                    },
                    queryParams: defaultParams,
                    body: payload,
                    failOnStatusCode: false
                }).then((response) => {
                    cy.log('Response:', response);
                    expect(response.status).to.equal(400);
                    expect(response.body).to.have.property('detail');
                });
            });
        });

        it('should handle missing primary keyword', () => {
            const payload = {
                topic: 'artificial intelligence'
            };

            cy.then(() => {
                makeRequest({
                    method: 'POST',
                    url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                    headers: {
                        'X-API-KEY': config.apiKey,
                        'Authorization': config.token,
                        'Content-Type': 'application/json'
                    },
                    queryParams: defaultParams,
                    body: payload,
                    failOnStatusCode: false
                }).then((response) => {
                    cy.log('Response:', response);
                    expect(response.status).to.equal(400);
                    expect(response.body).to.have.property('detail');
                });
            });
        });

        it('should handle unauthorized request', () => {
            const payload = {
                topic: 'artificial intelligence',
                primary_keyword: 'AI'
            };

            cy.then(() => {
                makeRequest({
                    method: 'POST',
                    url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                    headers: {
                        'X-API-KEY': 'invalid_key',
                        'Authorization': 'invalid_token',
                        'Content-Type': 'application/json'
                    },
                    queryParams: defaultParams,
                    body: payload,
                    failOnStatusCode: false
                }).then((response) => {
                    cy.log('Response:', response);
                    expect(response.status).to.equal(401);
                    expect(response.body).to.have.property('detail');
                });
            });
        });
    });
});