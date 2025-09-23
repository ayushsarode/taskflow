"use client";
import { useEffect, useMemo, useState } from "react";
import { authApi } from "../../lib/authApi.js";
import RequireAuth from "../../components/RequireAuth.jsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  FaProjectDiagram,
  FaTasks,
  FaExclamationCircle,
  FaCheckCircle,
  FaCalendarAlt,
  FaRocket,
} from "react-icons/fa";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"]; // green, amber, red

export default function DashboardPage() {
  const api = authApi();
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await api.get("/api/projects");
        setProjects(p.data.items || []);

        // Fetch all tasks from all projects
        const allTasksPromises = (p.data.items || []).map((project) =>
          api.get(`/api/tasks/project/${project._id}?limit=500`)
        );
        const tasksResponses = await Promise.all(allTasksPromises);
        const allTasksData = tasksResponses.flatMap(
          (res) => res.data.items || []
        );
        setAllTasks(allTasksData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusData = useMemo(() => {
    const counts = { done: 0, "in-progress": 0, todo: 0 };
    for (const t of allTasks) counts[t.status] = (counts[t.status] || 0) + 1;
    return [
      { name: "Done", value: counts.done, color: "#10b981" },
      { name: "In Progress", value: counts["in-progress"], color: "#f59e0b" },
      { name: "Todo", value: counts.todo, color: "#3b82f6" },
    ];
  }, [allTasks]);

  const projectTaskData = useMemo(() => {
    const projectMap = {};
    projects.forEach((p) => {
      projectMap[p._id] = { name: p.name, completed: 0, total: 0 };
    });

    allTasks.forEach((task) => {
      if (projectMap[task.projectId]) {
        projectMap[task.projectId].total++;
        if (task.status === "done") {
          projectMap[task.projectId].completed++;
        }
      }
    });

    return Object.values(projectMap);
  }, [projects, allTasks]);

  const overdue = useMemo(() => {
    const now = Date.now();
    return allTasks.filter(
      (t) =>
        t.deadline &&
        new Date(t.deadline).getTime() < now &&
        t.status !== "done"
    );
  }, [allTasks]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return allTasks
      .filter(
        (t) =>
          t.deadline &&
          new Date(t.deadline).getTime() > now &&
          t.status !== "done"
      )
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
      .slice(0, 3);
  }, [allTasks]);

  const recentTasks = useMemo(() => {
    return allTasks
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 3);
  }, [allTasks]);

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === "done").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
  <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <RequireAuth>
    <main className="h-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className=" mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              Dashboard
            </h1>
            <p className="mt-1 text-base text-gray-500">
              Welcome back! Here's an overview of your projects and tasks.
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 items-center">
          {[
            {
              label: "Total Projects",
              value: projects.length,
              icon: <FaProjectDiagram className="text-blue-600 text-2xl" />,
              bg: "bg-blue-50",
            },
            {
              label: "Total Tasks",
              value: totalTasks,
              icon: <FaTasks className="text-green-600 text-2xl" />,
              bg: "bg-green-50",
            },
            {
              label: "Completed",
              value: completedTasks,
              icon: <FaCheckCircle className="text-purple-600 text-2xl" />,
              bg: "bg-purple-50",
            },
            {
              label: "Overdue",
              value: overdue.length,
              icon: <FaExclamationCircle className="text-red-600 text-2xl" />,
              bg: "bg-red-50",
            },
          ].map((metric, idx) => (
            <div
              key={idx}
              className={`backdrop-blur-lg bg-white/80 rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow flex items-center justify-between gap-6`}
              style={{ minHeight: 90 }}
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {metric.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${metric.bg} flex items-center justify-center`}
              >
                {metric.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8 items-center">
          <div
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow"
            style={{ minHeight: 300 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaTasks className="text-blue-500" />
              Tasks by Status
            </h3>
            <div className="h-54">
              {allTasks.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FaTasks className="text-gray-400 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No tasks yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Create your first task to see the status breakdown
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow"
            style={{ minHeight: 300 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaRocket className="text-purple-500" />
              Project Progress
            </h3>
            <div className="h-54">
              {projects.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FaRocket className="text-gray-400 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No projects yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Create your first project to track progress
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectTaskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Bar
                      dataKey="completed"
                      stackId="a"
                      fill="#10b981"
                      name="Completed"
                    />
                    <Bar
                      dataKey="total"
                      stackId="a"
                      fill="#e5e7eb"
                      name="Total"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-3 mb-4 items-center">
          {/* Upcoming Deadlines */}
          <div
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow"
            style={{ minHeight: 280 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              Upcoming Deadlines
            </h3>
            {upcoming.length === 0 ? (
              <div className="text-center py-8">
                <FaCalendarAlt className="text-gray-400 text-3xl mx-auto mb-2" />
                <p className="text-gray-500 font-medium">
                  No upcoming deadlines
                </p>
                <p className="text-gray-400 text-sm">
                  Tasks with deadlines will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue Tasks */}
          <div
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow"
            style={{ minHeight: 280 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaExclamationCircle className="text-red-500" />
              Overdue Tasks
            </h3>
            {overdue.length === 0 ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-gray-400 text-3xl mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No overdue tasks</p>
                <p className="text-gray-400 text-sm">
                  Great job staying on track!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {overdue.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {task.title}
                      </p>
                      <p className="text-xs text-red-600">
                        Due {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs text-red-600 font-medium">
                      {Math.ceil(
                        (Date.now() - new Date(task.deadline).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                      d overdue
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow"
            style={{ minHeight: 280 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaTasks className="text-purple-500" />
              Recent Tasks
            </h3>
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <FaTasks className="text-gray-400 text-3xl mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No recent tasks</p>
                <p className="text-gray-400 text-sm">
                  Your recently created or updated tasks will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {projects.find((p) => p._id === task.projectId)?.name ||
                          "Unknown Project"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.status === "done"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    </RequireAuth>
  );
}
