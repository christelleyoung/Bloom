const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
const CONVERTKIT_SEQUENCE_ID = process.env.CONVERTKIT_SEQUENCE_ID;

const baseUrl = "https://api.convertkit.com/v3";

export const subscribeEmail = async (email: string) => {
  if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
    throw new Error("ConvertKit is not configured.");
  }

  const response = await fetch(`${baseUrl}/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: CONVERTKIT_API_KEY, email })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "ConvertKit subscription failed.");
  }

  return response.json();
};

export const sendBroadcast = async (subject: string, content: string) => {
  if (!CONVERTKIT_API_KEY) {
    throw new Error("ConvertKit is not configured.");
  }

  const payload: Record<string, string> = {
    api_key: CONVERTKIT_API_KEY,
    email_subject: subject,
    email_content: content
  };

  const response = await fetch(`${baseUrl}/broadcasts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "ConvertKit broadcast failed.");
  }

  return response.json();
};

export const sendSequenceStep = async (subject: string, content: string) => {
  if (!CONVERTKIT_API_KEY || !CONVERTKIT_SEQUENCE_ID) {
    throw new Error("ConvertKit sequence is not configured.");
  }

  const response = await fetch(`${baseUrl}/sequence_mails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: CONVERTKIT_API_KEY,
      sequence_id: CONVERTKIT_SEQUENCE_ID,
      subject,
      content
    })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "ConvertKit sequence failed.");
  }

  return response.json();
};
