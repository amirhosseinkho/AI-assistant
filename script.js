document.getElementById('model-select').addEventListener('change', function () {
    clearChatLog(); // پاک کردن چت با تغییر مدل
});

document.getElementById('chat-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const userInput = document.getElementById('user-input').value.trim();
    const model = document.getElementById('model-select').value;

    if (!userInput) return;

    addMessageToChatLog(userInput, 'user-message');
    document.getElementById('user-input').value = '';

    try {
        const reply = await chatWithModel(userInput, model);
        addMessageToChatLog(formatMessage(reply), 'bot-message');
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
    }, 100);
}

async function chatWithModel(message, model) {
    const response = await fetch('https://lingering-silence-c5f1.amirhossein-khoshb.workers.dev/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, model }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${errorData.error}`);
    }

    const data = await response.json();
    return data.reply;
}

// تابع فرمت‌دهی پیام
function formatMessage(message) {
    return message
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // بولد کردن
        .replace(/### (.*?)\n/g, '<h3>$1</h3>'); // تیتر
}
