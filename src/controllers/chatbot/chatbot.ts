import { RequestHandler } from "express";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

const model = openai("gpt-4o");

export const chatBot: RequestHandler = async (req, res) => {
  console.log(req.body);
  const { messages } = req.body;
  console.log(req.body.user?.id);
  const userId = req.body.user?.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const result = await streamText({
      model,
      messages: [
        {
          role: "system",
          content: `You are a highly intelligent financial assistant, specialized in personal and business finance. 
          Your goal is to help users optimize their budgets, save efficiently, invest wisely, and understand complex financial concepts. 
          You provide clear, precise, and personalized advice based on each user's financial situation.
          You can explain topics such as inflation, investment diversification, retirement savings, cryptocurrencies, taxation, and debt management. 
          Adapt your language to the user's level of financial knowledge and offer practical, actionable recommendations.
          If needed, ask relevant questions to better understand the user’s situation before providing a detailed and insightful response. 
          Your tone is professional, supportive, and educational.
            `,
        },
        ...messages,
      ],
    });

    let fullResponse = "";

    for await (const chunk of result.textStream) {
      console.log(chunk);
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      fullResponse += chunk;
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
