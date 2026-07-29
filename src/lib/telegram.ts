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

export async function telegramApproveChatJoinRequest(
  chatId: string,
  userId: string,
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId || !userId) return false;
  try {
    const response = await fetch(`${API}/bot${token}/approveChatJoinRequest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, user_id: Number(userId) }),
    });
    if (!response.ok) console.error("[telegram] approveChatJoinRequest:", await response.text());
    return response.ok;
  } catch (error) {
    console.error("[telegram] approveChatJoinRequest xatosi:", error);
    return false;
  }
}

export async function telegramDeclineChatJoinRequest(
  chatId: string,
  userId: string,
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId || !userId) return false;
  try {
    const response = await fetch(`${API}/bot${token}/declineChatJoinRequest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, user_id: Number(userId) }),
    });
    if (!response.ok) console.error("[telegram] declineChatJoinRequest:", await response.text());
    return response.ok;
  } catch (error) {
    console.error("[telegram] declineChatJoinRequest xatosi:", error);
    return false;
  }
}
