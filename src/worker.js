const TELEGRAM_BOT_TOKEN = '8446378846:AAFG-bfJXscPFcCHoq9ue-BCOhZP9-iHDsI';

const TEACHERS = [
	{
		key: "توجهی",
		name: "استاد توجهی",
		titles: [
			"ریش‌سفید ریاضی",
			"نرد اعظم",
			"پدرخوانده مشتق",
			"قاتل آرامش دانشجو"
		],
		description: "این بابا هرکی رو ببینه با مشتق خفه می‌کنه. حواست جمع باشه!"
	},

	{
		key: "ابراهیمی",
		name: "استاد ابراهیمی",
		titles: [
			"فرعون فیزیک",
			"شاه‌فنر",
			"اژدهای نیرو و گشتاور"
		],
		description: "به اندازه جرم یک فیل امتحان می‌گیره."
	}
];

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

function renderTeacher(t) {
	const titles = t.titles.map(x => `- ${x}`).join("\n");

	return `
👤 <b>${t.name}</b>

📚 <b>لقب ها:</b>
${titles}

📌 <b>توضیح:</b>
${t.description}
  `.trim();
}

export default {
	async fetch(request) {
		if (request.method !== 'POST') {
			return new Response('Not Found', { status: 404 });
		}

		const update = await request.json();
		const message = update.message;
		const chatId = message?.chat?.id;
		const text = message?.text;

		if (!text || !text.startsWith('/fuck')) {
			return new Response('Ignored');
		}

		const args = text.trim().split(" ");
		const name = args[1];

		if (!name) {
			await sendMessage(chatId, `احمق! اینجوری باید بزنی:\n<code>/fuck توجهی</code>`);
			return new Response('NO');
		}

		const teacher = TEACHERS.find(t => t.key === name);

		if (!teacher) {
			await sendMessage(chatId, "همچین معلمی نداریم نکبت 😐");
			return new Response('NO');
		}

		const output = renderTeacher(teacher);

		await sendMessage(chatId, output);
		return new Response('OK');
	}
};
