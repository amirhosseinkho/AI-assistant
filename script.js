// رویداد ارسال فرم
document.getElementById('chat-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput === '') return;

    // افزودن پیام کاربر به چت
    appendMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    // نمایش پیام "در حال پاسخ..."
    appendMessage('در حال دریافت پاسخ...', 'bot');

    try {
        const botResponse = await chatWithGPT(userInput);
        updateLastBotMessage(botResponse);
    } catch (error) {
        updateLastBotMessage(error);
        console.error('Error:', error);
    }
});

// تابع ارسال درخواست به API
async function chatWithGPT(message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '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'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-0125',
            messages: [{ role: 'user', content: message }]
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// تابع افزودن پیام به لاگ چت
function appendMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message');
    if (sender === 'user') {
        message.classList.add('user-message');
    } else {
        message.classList.add('bot-message');
    }
    message.innerText = text;
    document.getElementById('chat-log').appendChild(message);
    document.getElementById('chat-log').scrollTop = document.getElementById('chat-log').scrollHeight;
}

// به‌روزرسانی آخرین پیام ربات
function updateLastBotMessage(text) {
    const chatLog = document.getElementById('chat-log');
    const lastBotMessage = chatLog.querySelector('.bot-message:last-child');
    if (lastBotMessage) {
        lastBotMessage.innerText = text;
    }
}
