import { createBloom, updateBloom } from "@/lib/db";
import { generateBloomMessage, getFallbackBloomMessage, validateBloomMessage } from "@/lib/openai";
import { sendApprovedBloom, sendTestBloom } from "@/lib/convertkit";

const MAX_ATTEMPTS = 3;

type GenerateResult = {
  message: string;
  logId: number;
};

export async function generateBloomDraft(mode: string, intensity: string): Promise<GenerateResult> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const message = await generateBloomMessage({ mode, intensity });
    if (validateBloomMessage(message)) {
      const logId = createBloom({
        mode,
        intensity,
        content: message,
        status: "draft",
      });
      return { message, logId };
    }
  }

  const fallback = getFallbackBloomMessage();
  const logId = createBloom({
    mode,
    intensity,
    content: fallback,
    status: "draft",
  });
  return { message: fallback, logId };
}

export async function approveBloomSend(logId: number, content: string) {
  updateBloom(logId, { content, status: "approved" });
  const kitResponse = await sendApprovedBloom(content);
  updateBloom(logId, { status: "sent" });
  const details =
    typeof kitResponse?.id === "number"
      ? `Kit broadcast ID: ${kitResponse.id}`
      : kitResponse?.message || "";
  return { message: "Approved and scheduled in Kit.", details };
}

export async function sendTestBloomEmail(email: string, content: string) {
  const kitResponse = await sendTestBloom(email, content);
  const details =
    typeof kitResponse?.id === "number"
      ? `Kit test broadcast ID: ${kitResponse.id}`
      : kitResponse?.message || "";
  return { message: "Test email sent.", details };
}
