// Simple Kit client for subscriptions + approved sends.
const BASE_URL = "https://api.convertkit.com/v3";

function getConfig() {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;
  const sequenceId = process.env.CONVERTKIT_SEQUENCE_ID;

  if (!apiKey) {
    throw new Error("Missing CONVERTKIT_API_KEY.");
  }

  return { apiKey, formId, sequenceId };
}

export async function subscribeToKit(email: string) {
  const { apiKey, formId } = getConfig();

  if (!formId) {
    throw new Error("Missing CONVERTKIT_FORM_ID.");
  }

  const response = await fetch(`${BASE_URL}/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, email }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.message || "Failed to subscribe.");
  }
}

export async function sendApprovedBloom(content: string) {
  const { apiKey, sequenceId } = getConfig();

  if (!sequenceId) {
    throw new Error("Missing CONVERTKIT_SEQUENCE_ID.");
  }

  const response = await fetch(`${BASE_URL}/sequences/${sequenceId}/broadcasts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, subject: "Daily Bloom", content }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.message || "Failed to send broadcast.");
  }
}
