/**
 * WhatsApp via Interakt. Production-wired but env-gated:
 * with no WHATSAPP_API_KEY it logs and returns {stubbed:true} so the rest of
 * the app works during development. Once you have an Interakt account AND
 * Meta-approved templates, set the env vars and messages go out for real.
 *
 * NOTE: Meta requires pre-approved message *templates*. The `template` arg
 * below must match a template name approved in your Interakt dashboard.
 */
export interface WhatsAppMessage {
  to: string; // E.164, e.g. +919876543210
  template: string; // approved template name
  bodyValues?: string[]; // ordered {{1}}, {{2}} ... substitutions
}

export async function sendWhatsApp(msg: WhatsAppMessage) {
  const key = process.env.WHATSAPP_API_KEY;
  const url = process.env.WHATSAPP_API_URL ?? "https://api.interakt.ai/v1";

  if (!key) {
    console.log("[karlabh:whatsapp:stub]", JSON.stringify(msg));
    return { stubbed: true as const };
  }

  const phone = msg.to.replace(/^\+/, "");
  const countryCode = phone.startsWith("91") ? "+91" : "+" + phone.slice(0, 2);
  const number = phone.replace(/^91/, "");

  const res = await fetch(`${url}/public/message/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countryCode,
      phoneNumber: number,
      type: "Template",
      template: {
        name: msg.template,
        languageCode: "en",
        bodyValues: msg.bodyValues ?? [],
      },
    }),
  });

  if (!res.ok) {
    console.error("[karlabh:whatsapp] send failed", res.status, await res.text());
    return { ok: false as const, status: res.status };
  }
  return { ok: true as const };
}
