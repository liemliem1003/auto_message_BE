const axios = require('axios');

async function CohereAI(text) {
    const API_KEY = 'UUWIFEwRhAIsSSZwVkG0Nbclor21ye6SsFBVe3BQ';
    const URL = 'https://api.cohere.ai/generate';
    var body = {
        model: 'command-xlarge-nightly',
        prompt: 'this is a post for telegram, please rewrite in exactly 100 tokens including breakline for each part of post, decoration and some telegram icons: ' + text,
        max_tokens: 1000,
        temperature: 0.7,
    };
    var headers = {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    };
    
    try {
        const response = await axios.post(URL, body, { headers });
        return response.data.text;  // Trả về dữ liệu văn bản
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        return null;  // Nếu có lỗi, trả về null
    }
}

module.exports = CohereAI;
