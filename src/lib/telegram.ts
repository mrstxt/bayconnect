const API = "https://api.telegram.org";

/** Telegram API'ga xabar yuboradi. Xatolar buyurtmani saqlashni to'xtatmasligi kerak. */
export async function telegramSendMessage(
  chatId: string,
  text: string,
  options: Record<string, unknown> = {},
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return false;
  try {
    const response = await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, ...options }),
    });
    if (!response.ok) console.error("[telegram] sendMessage:", await response.text());
    return response.ok;
  } catch (error) {
    console.error("[telegram] sendMessage xatosi:", error);
    return false;
  }
}
