async function chatWithModel(message) {
    const response = await fetch('https://mybanana.vercel.app/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, model: "GPT-4o" }), // مدل به صورت ثابت تنظیم شده است
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, ${errorData.error}`);
    }

    const data = await response.json();
    return data.reply;
}