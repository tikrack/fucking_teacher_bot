const TELEGRAM_BOT_TOKEN = '8446378846:AAFG-bfJXscPFcCHoq9ue-BCOhZP9-iHDsI';

function escapeHTML(str) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

async function sendMessage(chatId, text) {
	const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
	const body = {
		chat_id: chatId,
		text: text,
		parse_mode: "HTML",
	};

	return await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
}

export default {
	async fetch(request) {
		if (request.method === 'POST') {
			const update = await request.json();
			const message = update.message;
			const chatId = message?.chat?.id;

			if (!message?.text?.startsWith('/fuck')) {
				return new Response('Ignored');
			}

			if (message?.text?.startsWith("/fuck")) {
				const args = message.text.trim().split(" ");
				const username = args[1];

				if (!username) {
					await sendMessage(chatId, `مرتیکه خر میخاری؟ اینجوری باید وارد کنی\n<code>/fuck [نام معلم]</code>`);
					return new Response('No username provided');
				}

				await sendMessage(chatId, username);

				return new Response('OK');
			}
		}

		return new Response('Not Found', { status: 404 });
	}
};
