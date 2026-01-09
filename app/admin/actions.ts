"use server";

import { cookies } from "next/headers";
import { generateBloomMessage, validateBloomMessage } from "@/lib/openai";
import { createBloom, updateBloom } from "@/lib/db";
import { sendApprovedBloom } from "@/lib/convertkit";

const MAX_ATTEMPTS = 3;

export async function login(formData: FormData) {
  const password = formData.get("password");
  if (password && password === process.env.ADMIN_PASSWORD) {
    // MVP-only cookie gate for /admin.
    cookies().set("bloombiatch-admin", "true", { httpOnly: true, sameSite: "strict" });
  }
}

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

  return {
    message: "",
    logId: null,
    error: "Generation failed validation. Try again.",
  };
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
    await sendApprovedBloom(content);
    updateBloom(logId, { status: "sent" });
    return { message: "Approved and scheduled in Kit." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send to Kit.";
    return { message };
  }
}
