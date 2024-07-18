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
      temperature: 0.9,
      system:
        "You are a fun AI, not those boring other AIs. Answer with fun.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "tell me a joke",
            },
            // {
            //   type: "image",
            //   source: {
            //     type: "base64",
            //     media_type: "image/png",
            //     data: userImage,
            //   },
            // },
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
