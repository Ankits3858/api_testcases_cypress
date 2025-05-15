require('dotenv').config();

describe('Blog Ideas API Tests', () => {
    const environments = ['staging', 'production'];

    environments.forEach((env) => {
        describe(`${env.toUpperCase()} Environment`, () => {
            const config = {
                baseUrl: env === 'production' ? process.env.PROD_BASE_URL : process.env.STAGING_BASE_URL,
                apiKey: env === 'production' ? process.env.PROD_X_API_KEY : process.env.STAGING_X_API_KEY,
                token: env === 'production' ? process.env.PROD_TOKEN : process.env.STAGING_TOKEN,
            };

            const defaultPayload = {
                topic: "Artificial Intelligence in Copywriting",
                primary_keyword: "test"
            };

            const queryParams = {
                engine: process.env.ENGINE,
                language: process.env.LANGUAGE,
                num_copies: process.env.NUM_COPIES
            };

            beforeEach(() => {
                // Reset the API state before each test
                cy.wrap(config).as('config');
            });

            describe('Positive Test Cases @positive', () => {
                it('should successfully generate blog ideas with valid input', () => {
                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': config.apiKey,
                            'Authorization': config.token,
                            'Content-Type': 'application/json'
                        },
                        qs: queryParams,
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        cy.log(JSON.stringify(response.body));
                        expect(response.status).to.eq(200);
                        expect(response.body).to.not.be.null;
                        expect(response.headers['content-type']).to.include('application/json');
                        
                        if (response.body.data) {
                            expect(response.body.data).to.be.an('array');
                            response.body.data.forEach(idea => {
                                expect(idea).to.have.property('content');
                            });
                        }
                    });
                });

                it('should successfully generate ideas with maximum allowed topic length', () => {
                    const longTopicPayload = {
                        ...defaultPayload,
                        topic: "A".repeat(500), // Assuming 500 is within allowed length
                        primary_keyword: "test"
                    };

                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': config.apiKey,
                            'Authorization': config.token,
                            'Content-Type': 'application/json'
                        },
                        qs: queryParams,
                        body: longTopicPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.data).to.be.an('array');
                    });
                });

                it('should successfully generate ideas with special characters in topic', () => {
                    const specialCharsPayload = {
                        ...defaultPayload,
                        topic: "AI & Machine Learning: Future-Proof Solutions!",
                        primary_keyword: "AI solutions"
                    };

                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': config.apiKey,
                            'Authorization': config.token,
                            'Content-Type': 'application/json'
                        },
                        qs: queryParams,
                        body: specialCharsPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.data).to.be.an('array');
                    });
                });

                it('should validate response time is within acceptable range', () => {
                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': config.apiKey,
                            'Authorization': config.token,
                            'Content-Type': 'application/json'
                        },
                        qs: queryParams,
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.duration).to.be.lessThan(30000);
                        expect(response.status).to.eq(200);
                    });
                });
            });

            describe('Negative Test Cases @negative', () => {
                it('should handle empty topic gracefully', () => {
                    const invalidPayload = {
                        ...defaultPayload,
                        topic: ""
                    };

                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': config.apiKey,
                            'Authorization': config.token,
                            'Content-Type': 'application/json'
                        },
                        qs: queryParams,
                        body: invalidPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        cy.log(JSON.stringify(response.body));
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle missing primary keyword gracefully', () => {
                    const invalidPayload = {
                        topic: "Artificial Intelligence in Copywriting"
                    };

                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': config.apiKey,
                            'Authorization': config.token,
                            'Content-Type': 'application/json'
                        },
                        qs: queryParams,
                        body: invalidPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        cy.log(JSON.stringify(response.body));
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle invalid API key', () => {
                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': 'invalid-api-key',
                            'Authorization': config.token,
                            'Content-Type': 'application/json'
                        },
                        qs: queryParams,
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(401);
                    });
                });

                it('should handle invalid token', () => {
                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': config.apiKey,
                            'Authorization': 'Bearer invalid-token',
                            'Content-Type': 'application/json'
                        },
                        qs: queryParams,
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(401);
                    });
                });

                it('should handle extremely long topic', () => {
                    const invalidPayload = {
                        ...defaultPayload,
                        topic: "A".repeat(10000) // Assuming this exceeds maximum allowed length
                    };

                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': config.apiKey,
                            'Authorization': config.token,
                            'Content-Type': 'application/json'
                        },
                        qs: queryParams,
                        body: invalidPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });

                it('should handle invalid query parameters', () => {
                    const invalidQueryParams = {
                        ...queryParams,
                        engine: 'invalid_engine',
                        language: 'invalid_lang'
                    };

                    cy.request({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/blog-ideas`,
                        headers: {
                            'X-API-KEY': config.apiKey,
                            'Authorization': config.token,
                            'Content-Type': 'application/json'
                        },
                        qs: invalidQueryParams,
                        body: defaultPayload,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                    });
                });
            });
        });
    });
}); 