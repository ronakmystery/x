
import { config } from './api.js';

export async function GPT(instruction,prompt) {
  // Simulated delay to mimic API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

//   // Return the prompt for testing purposes
//   return "i dont know";

//   Uncomment the actual API call when ready:

let customPrompt=instruction+prompt
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.API}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: customPrompt }],
    }),
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || "No response received.";
}