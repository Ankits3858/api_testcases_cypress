const axios = require('axios');
const TestConfig = require('../../config/testConfig');

describe('Blog Ideas API Tests', () => {
    let config;

    beforeEach(() => {
        // You can change this to 'production' to run tests against production
        config = new TestConfig('staging');
    });

    test('should generate blog ideas successfully', async () => {
        const payload = {
            topic: "Artificial Intelligence in Copywriting",
            primary_keyword: "test"
        };

        const queryParams = {
            engine: config.engine,
            language: config.language,
            num_copies: config.numCopies
        };

        try {
            const response = await axios({
                method: 'post',
                url: config.getBlogIdeasEndpoint(),
                headers: config.getHeaders(),
                params: queryParams,
                data: payload
            });

            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            // Add more specific assertions based on the expected response structure
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            throw error;
        }
    });

    test('should handle invalid topic input', async () => {
        const payload = {
            topic: "",  // Empty topic
            primary_keyword: "test"
        };

        const queryParams = {
            engine: config.engine,
            language: config.language,
            num_copies: config.numCopies
        };

        try {
            await axios({
                method: 'post',
                url: config.getBlogIdeasEndpoint(),
                headers: config.getHeaders(),
                params: queryParams,
                data: payload
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            // Add more specific error response assertions
        }
    });
}); 