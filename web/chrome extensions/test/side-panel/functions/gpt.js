
import { config } from './api.js';

export async function GPT(instruction, prompt) {

    let customPrompt = instruction + ": " + prompt


    // //   Simulated delay to mimic API call
    //   await new Promise((resolve) => setTimeout(resolve, 100));
    //   // Return the prompt for testing purposes
    //   return "gpt: "+customPrompt;


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
    console.log(data)
    return data.choices[0]?.message?.content || "No response received.";
}





export async function GPT_IMG(url) {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.API}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            "type": "text",
                            "text": "What is in this image in the red highlighted area?"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url":url,
                                "detail": "low"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 100
        }),
    });
    const data = await response.json();
    console.log(data)
    return data.choices[0]?.message?.content || "No response received.";


}