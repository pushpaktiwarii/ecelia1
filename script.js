import { isEcellRelevant } from './utils/validateInput.js';
import { SYSTEM_PROMPT } from './config/systemPrompt.js';

async function getBotResponse(userInput) {
  if (!isEcellRelevant(userInput)) {
    return "I'm here to help with E-Cell UCER queries only 😊";
  }

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userInput }] }],
      systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] }
    })
  });

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Hmm, I didn’t get that.";
}
