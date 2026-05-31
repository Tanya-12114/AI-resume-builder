const express = require("express");
const router = express.Router();

// ── Existing rule-based suggest (kept for backward compat) ──────────────────
function suggestImprovements(resumeText) {
  const suggestions = [];
  if (resumeText.length < 300)
    suggestions.push("Your resume looks short. Consider adding more experience or skills.");
  if (!resumeText.toLowerCase().includes("project"))
    suggestions.push("You haven't mentioned any projects. Adding a few can strengthen your resume.");
  if (!resumeText.toLowerCase().includes("experience"))
    suggestions.push("Include your work experience to improve credibility.");
  if (resumeText.toLowerCase().includes("i am"))
    suggestions.push("Avoid first-person language like 'I am'. Use professional statements instead.");
  if (!resumeText.toLowerCase().includes("skills"))
    suggestions.push("List your key skills to make your resume stronger.");
  if (suggestions.length === 0)
    suggestions.push("Your resume looks good! No major improvements suggested.");
  return suggestions;
}

router.post("/suggest", (req, res) => {
  const { resumeText } = req.body;
  const suggestions = suggestImprovements(resumeText || "");
  res.json({ suggestion: suggestions.join("\n") });
});

// ── Helpers ─────────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}
// ── General Resume Analysis ──────────────────────────────────────────────────
router.post("/analyze", async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({ error: "Resume text is too short." });
  }

  const prompt = `You are a professional resume coach and HR expert with 15+ years of experience.
Analyze the following resume and return ONLY a JSON object — no extra text, no markdown fences.

Resume:
"""
${resumeText}
"""

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "overallSummary": "<2-sentence summary of the resume's overall quality>",
  "atsScore": <number 0-100, how well this resume would pass an ATS system>,
  "atsSummary": "<1 sentence about ATS compatibility>",
  "sectionScores": {
    "Summary": <0-100>,
    "Experience": <0-100>,
    "Education": <0-100>,
    "Skills": <0-100>,
    "Formatting": <0-100>
  },
  "improvements": [
    { "type": "positive", "text": "<something done well>" },
    { "type": "warning", "text": "<something to fix>" },
    { "type": "suggestion", "text": "<actionable improvement tip>" }
  ],
  "toneNotes": [
    "<note about language or tone — e.g. weak verbs, first-person use, passive voice, filler words>"
  ]
}

Rules:
- improvements array: include at least 2 positives, 2 warnings, and 2 suggestions
- toneNotes: 2-4 specific observations about writing quality
- Be honest and specific, not generic
- Scores must reflect actual content quality`;

  try {
    const json = await callClaude(prompt);
    const parsed = JSON.parse(json);
    res.json(parsed);
  } catch (e) {
    console.error("Analysis error:", e.message);
    res.status(500).json({ error: "AI analysis failed. " + e.message });
  }
});

// ── JD Match Analysis ────────────────────────────────────────────────────────
router.post("/analyze-jd", async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({ error: "Resume text is too short." });
  }
  if (!jobDescription || jobDescription.trim().length < 30) {
    return res.status(400).json({ error: "Job description is too short." });
  }

  const prompt = `You are a professional resume coach and ATS expert.
Compare the resume against the job description and return ONLY a JSON object — no extra text, no markdown fences.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return this exact JSON structure:
{
  "overallScore": <number 0-100, quality of resume itself>,
  "overallSummary": "<2-sentence quality summary>",
  "atsScore": <number 0-100, ATS pass likelihood>,
  "atsSummary": "<1 sentence>",
  "matchScore": <number 0-100, how well the resume matches the JD>,
  "matchSummary": "<2-sentence explanation of the match quality>",
  "presentKeywords": ["<keyword found in both resume and JD>"],
  "missingKeywords": ["<important JD keyword missing from resume>"],
  "sectionScores": {
    "Summary": <0-100>,
    "Experience": <0-100>,
    "Education": <0-100>,
    "Skills": <0-100>,
    "Formatting": <0-100>
  },
  "improvements": [
    { "type": "positive", "text": "<something done well for this role>" },
    { "type": "warning",  "text": "<gap or mismatch with the JD>" },
    { "type": "suggestion", "text": "<how to tailor resume for this JD>" }
  ],
  "toneNotes": ["<language/tone observation>"]
}

Rules:
- presentKeywords: 5-12 keywords
- missingKeywords: 5-10 the most impactful missing ones
- improvements: at least 2 of each type
- toneNotes: 2-3 observations
- Be specific to this JD, not generic`;

  try {
    const json = await callClaude(prompt);
    const parsed = JSON.parse(json);
    res.json(parsed);
  } catch (e) {
    console.error("JD analysis error:", e.message);
    res.status(500).json({ error: "AI analysis failed. " + e.message });
  }
});

module.exports = router;
