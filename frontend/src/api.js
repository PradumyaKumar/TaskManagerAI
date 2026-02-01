// export async function fetchDashboard(project) {
//   const res = await fetch("http://localhost:5000/api/dashboard", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       project: project.name,
//       completedTasks: project.completedTasks,
//       totalTasks: project.totalTasks,
//       deadline: project.deadline,
//       teamMembers: project.members
//     })
//   });
//   if (!res.ok) {
//     throw new Error("Failed to fetch dashboard data");
//   }

//   return res.json();
// }

export async function fetchDashboard(project) {
  const res = await fetch("/api/dashboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      project: project.name,
      completedTasks: project.completedTasks,
      totalTasks: project.totalTasks,
      deadline: project.deadline,
      teamMembers: project.members
    })
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
}
