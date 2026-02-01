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

    const workloadByPerson = {};
    const memberStatus = {};

    teamMembers.forEach(m => {
      workloadByPerson[m.name] = m.hours;
      memberStatus[m.name] = m.status;
    });

    const summary = {
      deadline,
      totalTasks,
      completedTasks,
      workloadByPerson,
      memberStatus
    };

    const insights = {
      workloadInsight: "AI service temporarily unavailable.",
      riskAssessment: "Unable to assess project risk.",
      recommendations: [
        "Retry AI analysis later",
        "System handled AI failure gracefully"
      ],
      meta: { aiStatus: "partial" }
    };

    return res.status(200).json({ summary, insights });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
