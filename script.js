document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;
    appendMessage(userInput, 'user');
    document.getElementById('user-input').value = '';
    // شبیه‌سازی پاسخ ربات
    setTimeout(function() {
        appendMessage('سلام', 'bot');
    }, 500);
});

function appendMessage(text, sender) {
    var message = document.createElement('div');
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
