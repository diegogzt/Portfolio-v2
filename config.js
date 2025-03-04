// config.js - Create this file to centralize your API configuration
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variable with fallback (only for development)
const apiKey = process.env.DEEPSEEK_API_KEY || 'your-backup-key-for-dev-only';

// Create and export the configured client
export const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: apiKey,
});

// Standardized chat completion function with optimized settings
export async function getChatCompletion(userMessage, abortSignal = null) {
    const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
            { role: "system", content: getCustomContext() },
            { role: "user", content: userMessage },
        ],
        stream: false,
        max_tokens: 300,       // Reduced from 500 for faster responses
        temperature: 0.5,      // Lower temperature for more focused and faster responses
        timeout: 15000,        // 15 second timeout (measured in ms)
    }, {
        signal: abortSignal    // Allow aborting requests from outside
    });

    return response.choices[0].message.content;
}
}