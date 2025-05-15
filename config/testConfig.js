require('dotenv').config();

class TestConfig {
    constructor(env = 'staging') {
        this.environment = env.toLowerCase();
        this.baseUrl = this.environment === 'production' 
            ? process.env.PROD_BASE_URL 
            : process.env.STAGING_BASE_URL;
        this.apiKey = this.environment === 'production'
            ? process.env.PROD_X_API_KEY
            : process.env.STAGING_X_API_KEY;
        this.token = this.environment === 'production'
            ? process.env.PROD_TOKEN
            : process.env.STAGING_TOKEN;
        this.engine = process.env.ENGINE;
        this.language = process.env.LANGUAGE;
        this.numCopies = process.env.NUM_COPIES;
    }

    getHeaders() {
        return {
            'X-API-KEY': this.apiKey,
            'Authorization': this.token,
            'Content-Type': 'application/json'
        };
    }

    getBlogIdeasEndpoint() {
        return `${this.baseUrl}/v2/business/content/blog-ideas`;
    }
}

module.exports = TestConfig; 