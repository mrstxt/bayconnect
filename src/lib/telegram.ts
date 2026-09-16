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

export async function telegramDeleteMessage(chatId: string, messageId: number): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId || !messageId) return false;
  try {
    const response = await fetch(`${API}/bot${token}/deleteMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
    });
    if (!response.ok) console.error("[telegram] deleteMessage:", await response.text());
    return response.ok;
  } catch (error) {
    console.error("[telegram] deleteMessage xatosi:", error);
    return false;
  }
}

type InviteLinkResponse = {
  ok?: boolean;
  result?: { invite_link?: string };
  description?: string;
};

export async function telegramCreateJoinRequestInviteLink(name = "BayCommunity"): Promise<string | null> {
  const configured = process.env.TELEGRAM_COMMUNITY_INVITE_URL?.trim();
  if (configured) return configured;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_COMMUNITY_CHAT_ID;
  if (!token || !chatId) return null;

  try {
    const response = await fetch(`${API}/bot${token}/createChatInviteLink`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        name: name.slice(0, 32),
        creates_join_request: true,
      }),
    });
    const json = (await response.json().catch(() => null)) as InviteLinkResponse | null;
    if (!response.ok || !json?.result?.invite_link) {
      console.error("[telegram] createChatInviteLink:", json?.description ?? response.statusText);
      return null;
    }
    return json.result.invite_link;
  } catch (error) {
    console.error("[telegram] createChatInviteLink xatosi:", error);
    return null;
  }
}
