import { getAIInsights } from "../services/ai.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      project,
      completedTasks,
      totalTasks,
      deadline,
      teamMembers
    } = req.body;

    if (!teamMembers || !Array.isArray(teamMembers)) {
      return res.status(400).json({ error: "Invalid teamMembers" });
    }

    const workloadByPerson = {};
    const memberStatus = {};

    teamMembers.forEach(m => {
      workloadByPerson[m.name] = m.hours;
      memberStatus[m.name] = m.status;
    });

    const summary = {
      project,
      deadline,
      totalTasks,
      completedTasks,
      workloadByPerson,
      memberStatus
    };

    // 🔥 AI call (safe + graceful fallback inside)
    const insights = await getAIInsights(summary);

    return res.status(200).json({
      summary,
      insights
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
