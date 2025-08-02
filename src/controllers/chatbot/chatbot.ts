import { RequestHandler } from "express";

export const chatBot: RequestHandler = async (req, res) => {
  const { messages } = req.body;

  // Concatène ton prompt system + user messages
  const systemPrompt = `You are a highly intelligent financial assistant, specialized in personal and business finance. 
Your goal is to help users optimize their budgets, save efficiently, invest wisely, and understand complex financial concepts. 
You provide clear, precise, and personalized advice.`;

  const userPrompt = messages.map((m: any) => m.content).join("\n");
  const finalPrompt = `${systemPrompt}\nUser says: ${userPrompt}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const response = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(
        finalPrompt
      )}?private=true`
    );

    if (!response.body) {
      throw new Error("No response body");
    }

    // Pollinations ne stream pas en natif → on stream manuellement
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let fullResponse = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
  } catch (error) {
    console.error("Streaming error:", error);
    res.write(
      `data: ${JSON.stringify({ error: "Error processing request" })}\n\n`
    );
  } finally {
    res.end();
  }
};
