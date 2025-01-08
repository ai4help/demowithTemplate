import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../utils/dbConnect";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_AI_KEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to support streaming
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const sessionToken = req.cookies["next-auth.session-token"];
    const session = await db.collection("sessions").findOne({ sessionToken });

    if (!session || new Date() > new Date(session.expires)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {  question } = req.body;
const  userId = session.userId
    if (!userId || !question) {
      return res
        .status(400)
        .json({ message: "Session ID and Question are required." });
    }

 

    // Fetch the conversation history for the given session ID
    const conv = await db.collection("conv").findOne({ userId });
    const messages = conv?.history || [
      { role: "system", content: "You are a helpful assistant." },
    ];

    // Append the new question to the conversation
    messages.push({ role: "user", content: question });

    // Set up streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const responseStream = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 300,
      messages,
      stream: true, // Enable streaming
    });

    responseStream.data.on("data", async (chunk) => {
      const response = JSON.parse(chunk.toString("utf8"));
      const content = response.choices[0]?.delta?.content;

      if (content) {
        // Stream content to client
        res.write(`data: ${content}\n\n`);
      }

      // Finalize and save response if done
      if (response.choices[0]?.finish_reason === "stop") {
        const finalResponse = messages.concat({
          role: "assistant",
          content,
        });

        // Update conversation in the database
        await db.collection("sessions").updateOne(
          { sessionId },
          { $set: { history: finalResponse } },
          { upsert: true }
        );
        res.end(); // End the response stream
      }
    });

    responseStream.data.on("error", (err) => {
      console.error("Streaming error:", err);
      res.end(); // Close the stream on error
    });
  } catch (error) {
    console.error("Error handling session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
