/// <reference types="cypress" />
import { environments, getConfig, getDefaultQueryParams, getHeaders, makeRequest } from '../support/utils';

describe('Passive to Active Voice API Tests', () => {
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
            const queryParams = getDefaultQueryParams();
            const headers = getHeaders(config);

            const defaultPayload = {
                sentence: "The contract was cancelled by the studio managers. Hidden behind their stoic lawyers the messages were passed down. Words like iron clad and final notice were thrust into their faces. Voices were raised. Emotions were not kept in check. Fury rose unbridled."
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
                it('should successfully convert passive to active voice with valid input', () => {
                    const apiUrl = `${config.baseUrl}/v2/business/content/active-voice`;
                    
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
                        url: `${config.baseUrl}/v2/business/content/active-voice`,
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
                it('should handle empty sentence field', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/active-voice`,
                        headers,
                        queryParams,
                        body: { ...defaultPayload, sentence: "" },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty engine parameter', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/active-voice`,
                        headers,
                        queryParams: { ...queryParams, engine: '' },
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty language parameter', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/active-voice`,
                        headers,
                        queryParams: { ...queryParams, language: '' },
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle empty num_copies parameter', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/active-voice`,
                        headers,
                        queryParams: { ...queryParams, num_copies: '' },
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle invalid authentication', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/active-voice`,
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