document.getElementById('chat-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // جلوگیری از ری‌لود شدن صفحه

    const userInput = document.getElementById('user-input').value.trim();
    const model = document.getElementById('model-select').value;

    if (!userInput) return; // جلوگیری از ارسال پیام خالی

    addMessageToChatLog(userInput, 'user-message'); // نمایش پیام کاربر
    document.getElementById('user-input').value = ''; // پاک کردن ورودی

    try {
        const reply = await chatWithModel(userInput, model); // دریافت پاسخ از API
        addMessageToChatLog(reply, 'bot-message'); // نمایش پاسخ ربات
    } catch (error) {
        console.error('Error in chat:', error);
        addMessageToChatLog('مشکلی در ارتباط با سرور به وجود آمد.', 'bot-message');
    }
});

function addMessageToChatLog(message, className) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // اسکرول به انتهای چت
}

async function chatWithModel(message, model) {
    const response = await fetch('https://mybanana.vercel.app/myAPI/chat', {
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
