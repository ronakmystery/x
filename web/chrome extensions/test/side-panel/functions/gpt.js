
import { config } from './api.js';

let format="respond with json {title,description,tags}: "

export async function GPT(instruction, prompt) {

    let customPrompt = format+" "+instruction + ": " + prompt


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
    let data = await response.json();
    data=data.choices[0]?.message?.content || "No response received."
    data= data.match(/```json\s([\s\S]*?)```/)[1];
    console.log(data)

    return data
}



export async function GPT_IMAGINE(prompt) {

let instruction=""
    let body = {
        prompt:instruction+prompt,
        model: "dall-e-3",
        n: 1, // Number of images to generate
        size: "1024x1024", // Image size
        response_format: "b64_json",
      };
    
    const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.API}`,
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log(data)
    return `data:image/png;base64,`+data.data[0]?.b64_json || "No response received.";


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
                            "text": format
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url":url,
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300
        }),
    });

    let data = await response.json();
    data=data.choices[0]?.message?.content || "No response received."
    data= data.match(/```json\s([\s\S]*?)```/)[1];
    console.log(data)

    return data

}