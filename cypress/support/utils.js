// Common configuration for API tests
export const environments = () => {
    const env = Cypress.env('TEST_ENV');
    if (env === 'staging' || env === 'production') {
        return [env];
    }
    // If no specific environment is specified, run for both
    return ['staging', 'production'];
};

export const getConfig = (env) => {
    return {
        baseUrl: env === 'production' ? Cypress.env('PROD_BASE_URL') : Cypress.env('STAGING_BASE_URL'),
        apiKey: env === 'production' ? Cypress.env('PROD_X_API_KEY') : Cypress.env('STAGING_X_API_KEY'),
        token: env === 'production' ? Cypress.env('PROD_TOKEN') : Cypress.env('STAGING_TOKEN')
    };
};

export const getDefaultQueryParams = () => ({
    engine: Cypress.env('ENGINE') || 'premium',
    language: Cypress.env('LANGUAGE') || 'en',
    num_copies: Cypress.env('NUM_COPIES') || '1'
});

export const getHeaders = (config) => {
    const headers = {
        'X-API-KEY': config.apiKey,
        'Authorization': config.token,
        'Content-Type': 'application/json'
    };
    return headers;
};

// Helper function for making API requests
export const makeRequest = ({ method, url, headers, queryParams, body, failOnStatusCode = false }) => {
    const request = {
        method,
        url,
        headers,
        qs: queryParams,
        body,
        failOnStatusCode,
        timeout: 30000
    };
    
    return cy.request(request);
};

// Common test data for all endpoints
export const testData = {
    blogIdeas: {
        validTopic: "Artificial Intelligence in Copywriting",
        validKeyword: "test",
        longTopic: "A".repeat(500),
        specialCharsTopic: "AI & Machine Learning: Future-Proof Solutions!",
        specialCharsKeyword: "AI solutions"
    },
    blogIntros: {
        validTitle: "How Artificial Intelligence Will Change The World Of Copywriting",
        longTitle: "A".repeat(500),
        specialCharsTitle: "AI & ML: The Future of Content Creation! (2024 Update)",
        emptyTitle: ""
    },
    blogOutlines: {
        validTitle: "How AI Will Change Copywriting",
        validIntro: "Artificial Intelligence is revolutionizing the way we create and consume content. This article explores the transformative impact of AI on copywriting.",
        longIntro: "A".repeat(1000),
        specialCharsIntro: "In 2024 & beyond, AI will transform content creation! Here's why...",
    },
    articleWriterV3: {
        validTitle: "Supporting life on Mars is difficult but possible",
        validIntro: "Life on Mars may seem like a distant dream, but recent scientific advances are making it more feasible than ever before.",
        validSections: [
            "Advantages of establishing human settlements on Mars",
            "Technical challenges of Mars colonization",
            "Current progress in Mars exploration"
        ],
        longTitle: "A".repeat(500),
        longIntro: "A".repeat(1000),
        specialCharsTitle: "Mars & Beyond: Humanity's Next Giant Leap! (2024)",
        specialCharsIntro: "In 2024 & beyond, we're closer than ever to Mars colonization! Here's why..."
    }
}; 