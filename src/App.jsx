import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { fetchDashboard } from "./api";

/* ---------------- MAIN APP ---------------- */

export default function App() {
  const [dark, setDark] = useState(true);
  const [view, setView] = useState("config");
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

  const [project, setProject] = useState({
    name: "SaaS Platform Revamp",
    completedTasks: 1,
    totalTasks: 4,
    deadline: "2026-02-15",
    members: [
      { name: "Alice", hours: 30, status: "Pending" },
      { name: "Bob", hours: 40, status: "Pending" }
    ]
  });

  const generateDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboard(project);
      setAiData(data);
      setView("dashboard");
    } catch (err) {
      console.error(err);
      alert("Backend error while generating AI dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page(dark)}>
      <header style={styles.header}>
        <h1 style={{ color: dark ? "#e5e7eb" : "#111" }}>
          📊 AI Project Dashboard
        </h1>

        <button
          onClick={() => setDark(!dark)}
          style={styles.themeToggle(dark)}
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>
      </header>

      {loading && (
        <p style={{ color: "#a5b4fc", marginBottom: 16 }}>
          ⏳ Generating AI insights...
        </p>
      )}

      {view === "config" ? (
        <ConfigView
          project={project}
          setProject={setProject}
          dark={dark}
          onGenerate={generateDashboard}
        />
      ) : (
        <DashboardView
          project={project}
          aiData={aiData}
          dark={dark}
          onBack={() => setView("config")}
        />
      )}
    </div>
  );
}

/* ---------------- CONFIG VIEW ---------------- */

function ConfigView({ project, setProject, dark, onGenerate }) {
  const updateMember = (i, key, value) => {
    const members = [...project.members];
    members[i][key] = value;
    setProject({ ...project, members });
  };

  const addMember = () => {
    setProject({
      ...project,
      members: [...project.members, { name: "", hours: 0, status: "Pending" }]
    });
  };

  const removeMember = i => {
    setProject({
      ...project,
      members: project.members.filter((_, idx) => idx !== i)
    });
  };

  return (
    <div style={styles.card(dark)}>
      <h2 style={styles.sectionTitle(dark)}>✏️ Project Configuration</h2>

      <div style={styles.grid2}>
        <div>
          <label style={styles.label(dark)}>Project Name</label>
          <input
            value={project.name}
            onChange={e => setProject({ ...project, name: e.target.value })}
            style={styles.input(dark)}
          />
        </div>

        <div>
          <label style={styles.label(dark)}>Deadline</label>
          <input
            type="date"
            value={project.deadline}
            onChange={e => setProject({ ...project, deadline: e.target.value })}
            style={styles.input(dark)}
          />
        </div>

        <div>
          <label style={styles.label(dark)}>Completed Tasks</label>
          <input
            type="number"
            value={project.completedTasks}
            onChange={e =>
              setProject({ ...project, completedTasks: +e.target.value })
            }
            style={styles.input(dark)}
          />
        </div>

        <div>
          <label style={styles.label(dark)}>Total Tasks</label>
          <input
            type="number"
            value={project.totalTasks}
            onChange={e =>
              setProject({ ...project, totalTasks: +e.target.value })
            }
            style={styles.input(dark)}
          />
        </div>
      </div>

      <h3 style={styles.sectionTitle(dark)}>👥 Team Members</h3>

      <div style={styles.memberHeader(dark)}>
        <span>Name</span>
        <span>Hours</span>
        <span>Status</span>
        <span />
      </div>

      {project.members.map((m, i) => (
        <div key={i} style={styles.memberRow}>
          <input
            value={m.name}
            onChange={e => updateMember(i, "name", e.target.value)}
            style={styles.input(dark)}
          />

          <input
            type="number"
            value={m.hours}
            onChange={e => updateMember(i, "hours", +e.target.value)}
            style={styles.input(dark)}
          />

          <select
            value={m.status}
            onChange={e => updateMember(i, "status", e.target.value)}
            style={styles.input(dark)}
          >
            <option>Pending</option>
            <option>Done</option>
          </select>

          <button onClick={() => removeMember(i)} style={styles.removeBtn}>
            ✕
          </button>
        </div>
      ))}

      <button onClick={addMember} style={styles.addBtn}>
        ➕ Add Team Member
      </button>

      <button onClick={onGenerate} style={styles.primaryBtn}>
        🚀 Generate AI Dashboard
      </button>
    </div>
  );
}

/* ---------------- DASHBOARD VIEW ---------------- */


 function DashboardView({ project, aiData, dark, onBack }) {
  if (!aiData) {
    return <p>No dashboard data available</p>;
  }

  const { summary, insights } = aiData;

  const completion =
    (summary.completedTasks / summary.totalTasks) * 100;

  // Convert workloadByPerson object → chart-friendly array
  const workloadData = Object.entries(summary.workloadByPerson).map(
    ([name, hours]) => ({ name, hours })
  );

  return (
    <>
      <div style={styles.grid}>
        {/* TEAM WORKLOAD */}
        <div style={styles.card(dark)}>
          <h3 style={styles.sectionTitle(dark)}>👥 Team Workload</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <XAxis dataKey="name" stroke={dark ? "#cbd5f5" : "#374151"} />
                <Tooltip />
                <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PROJECT STATUS */}
        <div style={styles.card(dark)}>
          <h3 style={styles.sectionTitle(dark)}>📈 Project Status</h3>
          <p>
            {summary.completedTasks} / {summary.totalTasks} tasks completed
          </p>
          <p>Deadline: {summary.deadline}</p>

          <div style={styles.progress}>
            <div
              style={{
                ...styles.progressFill,
                width: `${completion}%`
              }}
            />
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div style={{ ...styles.card(dark), gridColumn: "span 2" }}>
          <h3 style={styles.sectionTitle(dark)}>🤖 AI Insights</h3>

          <p><strong>Workload Insight:</strong> {insights.workloadInsight}</p>
          <p><strong>Risk Assessment:</strong> {insights.riskAssessment}</p>

          <h4 style={{ marginTop: 12 }}>Recommendations</h4>
          <ul>
            {insights.recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          {insights.meta?.aiStatus !== "success" && (
            <p style={{ marginTop: 12, color: "#fbbf24" }}>
              ⚠ AI running in fallback mode
            </p>
          )}
        </div>
      </div>

      <button onClick={onBack} style={styles.backBtn}>
        ⬅ Back to Edit
      </button>
    </>
  );
}


/* ---------------- STYLES ---------------- */

const styles = {
  page: dark => ({
    minHeight: "100vh",
    padding: 32,
    background: dark
      ? "linear-gradient(135deg,#020617,#0f172a)"
      : "#f4f6fb",
    fontFamily: "Inter, system-ui, sans-serif"
  }),

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 24
  },

  themeToggle: dark => ({
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: dark ? "#334155" : "#e5e7eb",
    color: dark ? "#e5e7eb" : "#111"
  }),

  card: dark => ({
    background: dark ? "#020617" : "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    color: dark ? "#e5e7eb" : "#111"
  }),

  sectionTitle: dark => ({
    marginBottom: 16,
    color: dark ? "#e5e7eb" : "#111"
  }),

  label: dark => ({
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
    color: dark ? "#cbd5f5" : "#374151"
  }),

  input: dark => ({
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: dark ? "1px solid #334155" : "1px solid #cbd5f5",
    background: dark ? "#020617" : "#fff",
    color: dark ? "#e5e7eb" : "#111"
  }),

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
    gap: 24
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 24
  },

  memberHeader: dark => ({
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 40px",
    gap: 10,
    marginBottom: 8,
    fontSize: 13,
    color: dark ? "#94a3b8" : "#6b7280"
  }),

  memberRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 40px",
    gap: 10,
    marginBottom: 10
  },

  removeBtn: {
    border: "none",
    borderRadius: 8,
    background: "#fee2e2",
    cursor: "pointer"
  },

  addBtn: {
    marginTop: 12,
    background: "#e0e7ff",
    border: "none",
    borderRadius: 10,
    padding: "8px 14px",
    cursor: "pointer"
  },

  primaryBtn: {
    marginTop: 24,
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer"
  },

  backBtn: {
    marginTop: 24,
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#334155",
    color: "#fff",
    cursor: "pointer"
  },

  progress: {
    height: 10,
    background: "#334155",
    borderRadius: 6,
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg,#6366f1,#4f46e5)"
  }
};
