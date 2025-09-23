"use client";
import { useEffect, useState } from "react";
import { authApi } from "../../lib/authApi.js";
import Button from "../../components/ui/Button.jsx";
import RequireAuth from "../../components/RequireAuth.jsx";
import {
  FaPlus,
  FaProjectDiagram,
  FaCalendarAlt,

  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaTrash,
} from "react-icons/fa";


export default function ProjectsPage() {
  const api = authApi();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [projectTaskCounts, setProjectTaskCounts] = useState({});
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    projectId: null,
    projectName: "",
  });
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function fetchProjectsAndCounts() {
    setLoading(true);
    try {
      const api = authApi();
      const res = await api.get("/api/projects");
      const projects = res.data.items || [];
      setItems(projects);
      const counts = {};
      await Promise.all(
        projects.map(async (p) => {
          try {
            const r = await api.get(`/api/tasks/project/${p._id}?limit=1000`);
            counts[p._id] = r.data.total ?? (r.data.items || []).length;
          } catch (err) {
            counts[p._id] = 0;
          }
        })
      );
      setProjectTaskCounts(counts);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  useEffect(() => {
    fetchProjectsAndCounts();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/projects", { name, description });
      setName("");
      setDescription("");
      setShowCreateForm(false);
      await fetchProjectsAndCounts();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    const project = items.find((p) => p._id === projectId);
    setDeleteModal({
      open: true,
      projectId,
      projectName: project?.name || "this project",
    });
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/api/projects/${deleteModal.projectId}`);
      setDeleteModal({ open: false, projectId: null, projectName: "" });
      await fetchProjectsAndCounts();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete project");
      setDeleteModal({ open: false, projectId: null, projectName: "" });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = items.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-[750px] flex items-center justify-center">
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
      <div className="w-full px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className=" mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              Your Projects
            </h1>
            <p className="mt-1 text-base text-gray-500">
              Manage and organize all your projects in one place
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <FaPlus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col  sm:flex-row gap-4">
          <div className="relative flex-1 max-w-lg">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
      
        </div>

        {/* Create Project Modal */}
        {showCreateForm && (
          <div className="fixed inset-0  bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Project
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={create} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter project name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of your project"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      variant="secondary"
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-white py-3 rounded-lg "
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                    >
                      Create Project
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Project Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    const projectTaskCount = projectTaskCounts[p._id] ?? 0;
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Delete Project
                    </h2>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-2">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-900">
                      "{deleteModal.projectName}"
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-red-600">
                    This action cannot be undone. All associated tasks will also
                    be permanently removed.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      setDeleteModal({
                        open: false,
                        projectId: null,
                        projectName: "",
                      })
                    }
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
                  >
                    Delete Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading &&
          loaded &&
          (filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
                <FaProjectDiagram className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No projects found" : "No projects yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Get started by creating your first project"}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                  >
                    Create Your First Project
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((p) => {
                const projectTaskCount = projectTaskCounts[p._id] ?? 0;
                return (
                  <div
                    key={p._id}
                    className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/projects/${p._id}`)
                    }
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FaProjectDiagram className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {p.name}
                            </h3>
                            <p className="text-sm text-gray-500">Project</p>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(
                                dropdownOpen === p._id ? null : p._id
                              );
                            }}
                            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                          >
                            <FaEllipsisV className="h-4 w-4" />
                          </button>
                          {dropdownOpen === p._id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProject(p._id);
                                  setDropdownOpen(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                              >
                                <FaTrash className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {p.description ? (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {p.description}
                        </p>
                      ) : (
                        <div className="mb-4" style={{ height: "1.5em" }}></div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="h-3 w-3" />
                          <span>
                            {p.createdAt
                              ? new Date(p.createdAt).toLocaleDateString()
                              : "Unknown date"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {projectTaskCount} tasks
                        </span>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </main>
    </RequireAuth>
  );
}
