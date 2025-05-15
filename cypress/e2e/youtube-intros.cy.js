/// <reference types="cypress" />
import { environments, getConfig, getDefaultQueryParams, getHeaders, makeRequest } from '../support/utils';

describe('YouTube Intros API', () => {
    const defaultPayload = {
        topic: 'How to make delicious pasta',
        tone: 'friendly',
        language: 'en'
    };

    environments().forEach((env) => {
        const config = getConfig(env);
        const queryParams = getDefaultQueryParams();
        const headers = { 'api-key': config.apiKey };

        describe(`Environment: ${env}`, () => {
            describe('Positive Test Cases', () => {
                it('should generate YouTube intro with valid parameters', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/youtube-intros`,
                        headers,
                        queryParams,
                        body: defaultPayload
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property('data');
                        expect(response.duration).to.be.lessThan(30000);
                    });
                });
            });

            describe('Negative Test Cases', () => {
                it('should handle empty topic', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/youtube-intros`,
                        headers,
                        queryParams,
                        body: { ...defaultPayload, topic: '' },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(422);
                    });
                });

                it('should handle invalid tone', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/youtube-intros`,
                        headers,
                        queryParams,
                        body: { ...defaultPayload, tone: 'invalid' },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(422);
                    });
                });

                it('should handle invalid language', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/youtube-intros`,
                        headers,
                        queryParams,
                        body: { ...defaultPayload, language: 'xx' },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(422);
                    });
                });

                it('should handle unauthorized request', () => {
                    makeRequest({
                        method: 'POST',
                        url: `${config.baseUrl}/v2/business/content/youtube-intros`,
                        headers: { 'api-key': 'invalid' },
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