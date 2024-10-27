async function chatWithGPT(message) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-0125',
                messages: [{ role: 'user', content: message }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error ${response.status}: ${errorData.error.message}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error:', error);
        return `خطا: ${error.message}`;
    }
}
