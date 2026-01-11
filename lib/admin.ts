import { logBloom, updateBloomStatus } from "@/lib/db";
import {
  generateBloomMessage,
  getFallbackBloomMessage,
  validateBloomMessage,
} from "@/lib/openai";
import { sendApprovedBloom, sendTestBloom } from "@/lib/convertkit";

const MAX_ATTEMPTS = 3;

type GenerateResult = {
  message: string;
  logId: number;
};

export async function generateBloomDraft(
  mode: string,
  intensity: string
): Promise<GenerateResult> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const message = await generateBloomMessage({ mode, intensity });

    if (validateBloomMessage(message)) {
      const { id } = logBloom(message, "draft");
      return { message, logId: id };
    }
  }

  const fallback = getFallbackBloomMessage();
  const { id } = logBloom(fallback, "draft");
  return { message: fallback, logId: id };
}

export async function approveBloomSend(logId: number, content: string) {
  // Mark approved
  updateBloomStatus(logId, "approved");

  // Send to Kit
  const kitResponse = await sendApprovedBloom(content);

  // Mark sent
  updateBloomStatus(logId, "sent");

  const details =
    typeof (kitResponse as any)?.id === "number"
      ? `Kit broadcast ID: ${(kitResponse as any).id}`
      : (kitResponse as any)?.message || "";

  return { message: "Approved and scheduled in Kit.", details };
}

export async function sendTestBloomEmail(email: string, content: string) {
  const kitResponse = await sendTestBloom(email, content);

  const details =
    typeof (kitResponse as any)?.id === "number"
      ? `Kit test broadcast ID: ${(kitResponse as any).id}`
      : (kitResponse as any)?.message || "";

  return { message: "Test email sent.", details };
}
