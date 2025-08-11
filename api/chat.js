// Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY missing' });

  let prompt = 'Hallo!';
  try { prompt = (req.body && req.body.prompt) || 'Hallo!'; } catch {}

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Je bent een behulpzame assistent.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data?.error?.message || 'OpenAI error' });

    const text = data?.choices?.[0]?.message?.content || 'Geen antwoord.';
    return res.status(200).json({ response: text });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
