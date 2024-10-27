document.getElementById('chat-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const userInput = document.getElementById('user-input').value.trim();
    const selectedModel = document.getElementById('model-select').value;

    if (userInput === '') return;

    appendMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    try {
        const botResponse = await chatWithModel(userInput, selectedModel);
        appendMessage(botResponse, 'bot');
    } catch (error) {
        console.error('Error:', error);
        appendMessage(`خطا: ${error.message}`, 'bot');
    }
});

async function chatWithModel(message, model) {
    const response = await fetch('https://mybanana.vercel.app/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, model: model }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${errorData.error}`);
    }

    const data = await response.json();
    return data.reply;
}

function appendMessage(text, sender) {
    const chatLog = document.getElementById('chat-log');
    const message = document.createElement('div');
    message.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    message.innerText = text;
    chatLog.appendChild(message);
}
