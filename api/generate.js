import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, keywords, platform } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  try {
    const prompt = `Generate SEO content for a video. 
Title: ${title}
Keywords: ${keywords}
Platform: ${platform}

Return JSON with fields: tags (comma separated), hashtags (comma separated with #), description (2-3 sentences).`;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try to parse JSON from Gemini response
    let tags = "", hashtags = "", description = "";
    try {
      const parsed = JSON.parse(text);
      tags = parsed.tags || "";
      hashtags = parsed.hashtags || "";
      description = parsed.description || "";
    } catch {
      description = text;
    }

    res.status(200).json({ tags, hashtags, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}