"use server";

import { generateBloomMessage, getFallbackBloomMessage, validateBloomMessage } from "@/lib/openai";
import { createBloom, updateBloom } from "@/lib/db";
import { sendApprovedBloom, sendTestBloom } from "@/lib/convertkit";

const MAX_ATTEMPTS = 3;

export async function generateBloom(
  _prevState: { message: string; logId: number | null; error: string },
  formData: FormData
) {
  const mode = String(formData.get("mode") || "Work");
  const intensity = String(formData.get("intensity") || "Hard");

  if (!process.env.OPENAI_API_KEY) {
    return { message: "", logId: null, error: "Missing OPENAI_API_KEY." };
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const message = await generateBloomMessage({ mode, intensity });
    if (validateBloomMessage(message)) {
      const logId = createBloom({
        mode,
        intensity,
        content: message,
        status: "draft",
      });
      return { message, logId, error: "" };
    }
  }

  const fallback = getFallbackBloomMessage();
  const logId = createBloom({
    mode,
    intensity,
    content: fallback,
    status: "draft",
  });
  return { message: fallback, logId, error: "" };
}

export async function approveBloom(
  prevState: { message: string },
  formData: FormData
) {
  const logId = Number(formData.get("logId"));
  const content = String(formData.get("content") || "").trim();

  if (!logId || !content) {
    return { message: "Missing draft content." };
  }

  updateBloom(logId, { content, status: "approved" });

  try {
    // Only approved content is sent to Kit.
    const kitResponse = await sendApprovedBloom(content);
    updateBloom(logId, { status: "sent" });
    const details =
      typeof kitResponse?.id === "number"
        ? `Kit broadcast ID: ${kitResponse.id}`
        : kitResponse?.message || "";
    return { message: "Approved and scheduled in Kit.", details };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send to Kit.";
    return { message, details: "" };
  }
}

export async function sendTestEmail(
  prevState: { message: string; details: string },
  formData: FormData
) {
  const email = String(formData.get("email") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!email || !content) {
    return { message: "Test email and content are required.", details: "" };
  }

  try {
    const kitResponse = await sendTestBloom(email, content);
    const details =
      typeof kitResponse?.id === "number"
        ? `Kit test broadcast ID: ${kitResponse.id}`
        : kitResponse?.message || "";
    return { message: "Test email sent.", details };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send test email.";
    return { message, details: "" };
  }
}
