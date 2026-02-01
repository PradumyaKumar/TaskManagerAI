export async function getAIInsights(summary) {
  console.log(process.env.GEMINI_API_KEY)
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `
You are an AI project management assistant.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT use markdown
- Do NOT add explanations
- JSON must be COMPLETE

JSON schema:
{
  "workloadInsight": "string",
  "riskAssessment": "string",
  "recommendations": ["string"]
}

Project Data:
${JSON.stringify(summary, null, 2)}
`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 500
        }
      })
    });

    const data = await response.json();
    console.log("FULL GEMINI JSON:", data);

    // Handle API errors (quota, auth, etc.)
    if (data.error) {
      if (data.error.code === 429) throw new Error("QUOTA_EXCEEDED");
      throw new Error(data.error.message);
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text || "")
        .join("");

    if (!text) throw new Error("EMPTY_RESPONSE");

    // 🛡️ Defensive JSON extraction (handles truncation)
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("TRUNCATED_JSON");
    }

    const parsed = JSON.parse(text.slice(start, end + 1));

    return {
      ...parsed,
      meta: { aiStatus: "full" }
    };

  } catch (err) {
    console.error("Gemini AI handled gracefully:", err.message);

    // 🔁 Controlled fallback for frontend
    return {
      workloadInsight:
        "AI service temporarily unavailable.",
      riskAssessment:
        "Unable to assess project risk.",
      recommendations: [
        "Retry AI analysis later",
        "System handled AI failure gracefully"
      ],
      meta: { aiStatus: "partial" }
    };
  }
}
