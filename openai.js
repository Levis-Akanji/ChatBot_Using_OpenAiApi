require('dotenv').config();

class OpenAIAPI {
    static async generateResponse(userMessage, conversationHistory = []) {
        const apiKey = process.env.OPENAI_API_KEY;
        const endpoint = 'https://api.openai.com/v1/chat/completions';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // Use the correct model name
                    messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
                    max_tokens: 150
                }),
            });

            const responseData = await response.json();

            // Log the full API response for debugging
            console.log('Full Response from OpenAI API:', JSON.stringify(responseData, null, 2));

            // Check for API errors and log them
            if (responseData.error) {
                console.error('OpenAI API Error:', responseData.error.message);
                return `Error: ${responseData.error.message}`;
            }

            // Check if choices exist and are valid
            if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
                return responseData.choices[0].message.content;
            } else {
                console.error('Error: No valid response from OpenAI API');
                return 'Sorry, I couldn\'t understand that.';
            }
        } catch (error) {
            // Catch and log any unexpected errors
            console.error('Error in generateResponse:', error);
            return 'Sorry, something went wrong.';
        }
    }
}

module.exports = { OpenAIAPI };
