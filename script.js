// رویداد ارسال فرم
document.getElementById('chat-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const userInput = document.getElementById('user-input').value.trim();
    const selectedModel = document.getElementById('model-select').value; // مدل انتخابی از فرم

    if (userInput === '') return;

    // افزودن پیام کاربر به چت
    appendMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    // نمایش پیام "در حال دریافت پاسخ..."
    appendMessage('در حال دریافت پاسخ...', 'bot');

    try {
        const botResponse = await chatWithModel(userInput, selectedModel); // استفاده از مدل انتخابی
        console.log('Bot response:', botResponse); // لاگ برای دیباگ
        updateLastBotMessage(botResponse);
    } catch (error) {
        updateLastBotMessage(`خطا: ${error.message}`);
        console.error('Error:', error);
    }
});

// تابع ارسال درخواست به API با مدل انتخابی
async function chatWithModel(message, model) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
            model: model, // ارسال مدل انتخاب شده
            messages: [{ role: 'user', content: message }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${errorData.error.message}`);
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
