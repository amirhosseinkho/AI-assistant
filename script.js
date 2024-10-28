// ذخیره پیام‌ها در یک آرایه
let chatHistory = [];

document.getElementById('model-select').addEventListener('change', function () {
    clearChatLog(); // پاک کردن چت با تغییر مدل
    chatHistory = []; // پاک کردن تاریخچه چت
});

document.getElementById('chat-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const userInput = document.getElementById('user-input').value.trim();
    const model = document.getElementById('model-select').value;

    if (!userInput) return;

    addMessageToChatLog(userInput, 'user-message');
    document.getElementById('user-input').value = '';

    // اضافه کردن پیام کاربر به تاریخچه
    chatHistory.push({ role: 'user', content: userInput });

    try {
        const reply = await chatWithModel(chatHistory, model);
        addMessageToChatLog(reply, 'bot-message');

        // اضافه کردن پاسخ ربات به تاریخچه
        chatHistory.push({ role: 'assistant', content: reply });
    } catch (error) {
        console.error('Error in chat:', error);
        addMessageToChatLog('خطا در ارتباط با سرور', 'error-message');
    }
});

function clearChatLog() {
    const chatLog = document.getElementById('chat-log');
    chatLog.innerHTML = ''; // پاک کردن تمام پیام‌ها
}

function addMessageToChatLog(message, className) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.innerHTML = message;
    chatLog.appendChild(messageElement);

    // اسکرول به انتهای چت
    setTimeout(() => {
        chatLog.scrollTop = chatLog.scrollHeight;
    }, 0); // تأخیر صفر برای اطمینان از اسکرول
}

async function chatWithModel(messages, model) {
    const response = await fetch('https://lingering-silence-c5f1.amirhossein-khoshb.workers.dev/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            message: messages.map(m => m.content).join('\n') // ساخت متن کامل از تاریخچه پیام‌ها
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${errorData.error}`);
    }

    const data = await response.json();
    return data.reply;
}
