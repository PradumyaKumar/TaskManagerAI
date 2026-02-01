import express from "express";
import cors from "cors";
import { getAIInsights } from "./ai.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // ✅ REQUIRED for user input

// 🔹 Convert raw user input into AI-friendly summary
function summarizeProject(project) {
  const workloadByPerson = {};

  project.teamMembers.forEach(member => {
    workloadByPerson[member.name] =
      (workloadByPerson[member.name] || 0) + Number(member.hours || 0);
  });

  return {
    projectName: project.projectName,
    deadline: project.deadline,
    totalTasks: Number(project.totalTasks),
    completedTasks: Number(project.completedTasks),
    workloadByPerson,
    memberStatus: project.teamMembers.reduce((acc, m) => {
      acc[m.name] = m.status;
      return acc;
    }, {})
  };
}

// 🔥 USER-DRIVEN DASHBOARD API
app.post("/api/dashboard", async (req, res) => {
  try {
    const project = req.body;

    if (!project || !project.teamMembers) {
      return res.status(400).json({
        error: "Invalid project data"
      });
    }

    const summary = summarizeProject(project);

    const insights = await getAIInsights(summary);

    res.json({
      summary,
      insights
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.status(500).json({
      error: "Failed to generate dashboard"
    });
  }
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
