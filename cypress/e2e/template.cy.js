/// <reference types="cypress" />
import { environments, getConfig, getDefaultQueryParams, getHeaders, makeRequest } from '../support/utils';

describe('API Name Tests', () => {
    environments.forEach((env) => {
        describe(`${env.toUpperCase()} Environment`, () => {
            const config = getConfig(env);
            const queryParams = getDefaultQueryParams();
            const headers = getHeaders(config);

            const defaultPayload = {
                // Add your default payload here
            };

            beforeEach(() => {
                cy.wrap(config).as('config');
            });

            context('Positive Test Cases @positive', () => {
                it('should successfully process valid request', () => {
                    makeRequest({
                        method: 'POST', // Change method as needed
                        url: `${config.baseUrl}/your-endpoint-path`,
                        headers,
                        queryParams,
                        body: defaultPayload
                    }).then((response) => {
                        cy.log(JSON.stringify(response.body));
                        expect(response.status).to.eq(200);
                        expect(response.body).to.not.be.null;
                        expect(response.headers['content-type']).to.include('application/json');
                        
                        // Add specific response validations
                    });
                });

                it('should handle optional parameters', () => {
                    const payloadWithOptionals = {
                        ...defaultPayload,
                        // Add optional parameters
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/your-endpoint-path`,
                        headers,
                        queryParams,
                        body: payloadWithOptionals
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        // Add specific validations
                    });
                });

                it('should validate response time', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/your-endpoint-path`,
                        headers,
                        queryParams,
                        body: defaultPayload
                    }).then((response) => {
                        expect(response.duration).to.be.lessThan(30000);
                        expect(response.status).to.eq(200);
                    });
                });
            });

            context('Negative Test Cases @negative', () => {
                it('should handle missing required fields', () => {
                    const invalidPayload = {
                        // Omit required fields
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/your-endpoint-path`,
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
                        url: `${config.baseUrl}/your-endpoint-path`,
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
                        // Add invalid parameters
                    };

                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/your-endpoint-path`,
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