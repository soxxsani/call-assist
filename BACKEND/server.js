import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// POST endpoint to get AI suggestions
app.post("/get-suggestions", async (req, res) => {
  const { text } = req.body;

  const prompt = `
You are a Hinglish payment reminder assistant.
User spoke: "${text}"
Reply with multiple short Hinglish sentences the user can say.
Use simple Indian Hinglish. Be firm but polite.
Focus only on payment, payment date, or clear closure.
No advice, explanations, bullet points, threats, or "you must pay".
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300
      })
    });

    const data = await response.json();
    res.json({ suggestions: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
