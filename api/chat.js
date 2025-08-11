export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY missing" });
  }

  try {
    const { messages } = req.body;

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      throw new Error(errorText);
    }

    const data = await apiRes.json();
    res.status(200).json({ message: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
