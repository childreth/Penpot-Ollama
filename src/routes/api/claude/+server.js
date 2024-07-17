import Anthropic from "@anthropic-ai/sdk";
import {API_KEY} from '$env/static/private'; /* do not forget $env! */
//import fs from "fs";

// const base64Image = fs.readFileSync(`src/lib/images/drawing.png`, {
//   encoding: "base64",
// });

const anthropic = new Anthropic({
  apiKey: API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});

export async function POST({ request }) {
  try {
    console.log("POST called");
    const { userImage = "default", message = "default" } = await request.json();

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.6,
      system:
        "You are playing a Pictionary type game and have to guess what is being drawn. You should only guess the what the object is in a single sentence. Do not explain anything about the object. Add emotion to the guess if it is applicable and try to match it with a celebrity. Example guesses: angry brown poodle, sad bowl of fruit, red apple that looks like Ryan Renolds. Be saracastic with your answers, always sarcastically praise their artistic skills, be sure to liberally add emojis. You may also decide to request a portrait",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "tell me about this image",
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: userImage,
              },
            },
          ],
        },
      ],
    });
    console.log(msg.content[0].text);
    let claude = msg.content[0].text;

    // const { message } = await request.json();
    // JSON.stringify(message);

    //console.log("request server:", message);

    return new Response(JSON.stringify({ message: claude }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
