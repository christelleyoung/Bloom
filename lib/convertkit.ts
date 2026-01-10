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

async function parseKitResponse(response: Response, fallbackMessage: string) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || fallbackMessage);
  }
  return payload;
}

type SubscribePayload = {
  email: string;
  firstName?: string;
  bloomProblem?: string;
  bloomIntensity?: string;
};

export async function subscribeToKit({
  email,
  firstName,
  bloomProblem,
  bloomIntensity,
}: SubscribePayload) {
  const { apiKey, formId } = getConfig();

  if (!formId) {
    throw new Error("Missing CONVERTKIT_FORM_ID.");
  }

  const response = await fetch(`${BASE_URL}/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      email,
      first_name: firstName || undefined,
      fields: {
        bloom_problem: bloomProblem || undefined,
        bloom_intensity: bloomIntensity || undefined,
      },
    }),
  });

  await parseKitResponse(response, "Failed to subscribe.");
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

  return parseKitResponse(response, "Failed to send broadcast.");
}

export async function sendTestBloom(email: string, content: string) {
  const { apiKey } = getConfig();
  const response = await fetch(`${BASE_URL}/broadcasts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      subject: "Daily Bloom (Test)",
      content,
      email_address: email,
    }),
  });

  return parseKitResponse(response, "Failed to send test broadcast.");
}
