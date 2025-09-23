"use client";
import { useEffect, useMemo, useState, use } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { authApi } from "../../../lib/authApi.js";
import Modal from "../../../components/ui/Modal.jsx";
import Button from "../../../components/ui/Button.jsx";
import RequireAuth from "../../../components/RequireAuth.jsx";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaClock,
} from "react-icons/fa";

const statusColumns = [
  {
    key: "todo",
    title: "To Do",
    color: "bg-gray-50 border-gray-200",
    headerColor: "text-gray-700",
    countColor: "bg-white text-gray-600 border border-gray-200",
  },
  {
    key: "in-progress",
    title: "In Progress",
    color: "bg-blue-50 border-blue-200",
    headerColor: "text-blue-700",
    countColor: "bg-white text-blue-600 border border-blue-200",
  },
  {
    key: "done",
    title: "Done",
    color: "bg-green-50 border-green-200",
    headerColor: "text-green-700",
    countColor: "bg-white text-green-600 border border-green-200",
  },
];

function priorityConfig(priority) {
  return priority === "high"
    ? { 
        bg: "bg-red-100", 
        text: "text-red-700", 
        label: "High",
        dot: "bg-red-500"
      }
    : priority === "medium"
    ? {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Medium",
        dot: "bg-yellow-500"
      }
    : {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Low",
        dot: "bg-green-500"
      };
}

export default function ProjectBoard({ params }) {
  const api = authApi();
  const { id: projectId } = use(params);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    taskId: null,
    taskTitle: "",
  });
  const [form, setForm] = useState({
    title: "",
    priority: "medium",
    status: "todo",
    deadline: "",
    description: "",
  });

  const grouped = useMemo(() => {
    const g = { todo: [], "in-progress": [], done: [] };
    for (const t of tasks) g[t.status]?.push(t);
    return g;
  }, [tasks]);

  async function load() {
    const res = await api.get(`/api/tasks/project/${projectId}`);
    setTasks(res.data.items || []);
  }

  useEffect(() => {
    load();
  }, [projectId]);

  async function onDragEnd(result) {
    const { destination, draggableId } = result;
    if (!destination) return;
    await api.patch(`/api/tasks/${draggableId}`, {
      status: destination.droppableId,
    });
    await load();
  }

  async function saveTask(e) {
    e.preventDefault();
    if (editMode && editTaskId) {
      await api.patch(`/api/tasks/${editTaskId}`, {
        ...form,
        deadline: form.deadline || undefined,
      });
    } else {
      await api.post("/api/tasks", {
        ...form,
        projectId,
        deadline: form.deadline || undefined,
      });
    }
    setOpen(false);
    setEditMode(false);
    setEditTaskId(null);
    setForm({
      title: "",
      priority: "medium",
      status: "todo",
      deadline: "",
      description: "",
    });
    await load();
  }

  function openEditTask(task) {
    setForm({
      title: task.title || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
      deadline: task.deadline ? task.deadline.slice(0, 10) : "",
      description: task.description || "",
    });
    setEditMode(true);
    setEditTaskId(task._id);
    setOpen(true);
  }

  async function deleteTask(taskId) {
    const task = tasks.find((t) => t._id === taskId);
    setDeleteModal({
      open: true,
      taskId,
      taskTitle: task?.title || "this task",
    });
  }

  async function confirmDeleteTask() {
    try {
      await api.delete(`/api/tasks/${deleteModal.taskId}`);
      setDeleteModal({ open: false, taskId: null, taskTitle: "" });
      await load();
    } catch (error) {
      console.error("Failed to delete task:", error);
      setDeleteModal({ open: false, taskId: null, taskTitle: "" });
    }
  }

  return (
    <RequireAuth>
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Project Board
            </h1>
            <p className="text-gray-500 mt-1">Organize and track your tasks</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setOpen(true)}
          >
            <FaPlus className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          {/* Clean Kanban Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {statusColumns.map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg border-2 p-4 transition-colors ${col.color} ${
                      snapshot.isDraggingOver ? 'border-blue-300 bg-blue-50' : ''
                    }`}
                  >
                    {/* Simple Column Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-medium text-sm uppercase tracking-wide ${col.headerColor}`}>
                        {col.title}
                      </h3>
                      <span className={`text-sm px-2 py-1 rounded-md ${col.countColor}`}>
                        {grouped[col.key].length}
                      </span>
                    </div>

                    {/* Task Cards */}
                    <div className="space-y-3 min-h-[200px] h-[calc(85vh-300px)] max-h-[calc(85vh-300px)] overflow-y-auto">
                      {grouped[col.key].map((t, idx) => (
                        <Draggable draggableId={t._id} index={idx} key={t._id}>
                          {(p, snapshot) => (
                            <div
                              ref={p.innerRef}
                              {...p.draggableProps}
                              {...p.dragHandleProps}
                              className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer group hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                              }`}
                            >
                              {/* Task Content */}
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-medium text-gray-900 text-sm leading-relaxed flex-1">
                                    {t.title}
                                  </h4>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openEditTask(t);
                                      }}
                                      className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
                                      aria-label="Edit task"
                                    >
                                      <FaEdit className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTask(t._id);
                                      }}
                                      className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                                      aria-label="Delete task"
                                    >
                                      <FaTrash className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${priorityConfig(t.priority).dot}`}></div>
                                    <span className={`text-xs px-2 py-1 rounded ${priorityConfig(t.priority).bg} ${priorityConfig(t.priority).text}`}>
                                      {priorityConfig(t.priority).label}
                                    </span>
                                  </div>
                                  {t.deadline && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <FaClock className="w-3 h-3" />
                                      {new Date(t.deadline).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* Clean Modal */}
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            setEditMode(false);
            setEditTaskId(null);
            setForm({
              title: "",
              priority: "medium",
              status: "todo",
              deadline: "",
              description: "",
            });
          }}
          title={editMode ? "Edit Task" : "New Task"}
          actions={
            <div className="flex gap-3">
              <Button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                onClick={() => {
                  setOpen(false);
                  setEditMode(false);
                  setEditTaskId(null);
                  setForm({
                    title: "",
                    priority: "medium",
                    status: "todo",
                    deadline: "",
                    description: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={saveTask}
              >
                {editMode ? "Update" : "Save"}
              </Button>
            </div>
          }
        >
          <form className="space-y-4" onSubmit={saveTask}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline (optional)
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-24 transition-colors"
                placeholder="Task description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </form>
        </Modal>

        {/* Clean Delete Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTrash className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Delete Task
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">"{deleteModal.taskTitle}"</span>?
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    setDeleteModal({ open: false, taskId: null, taskTitle: "" })
                  }
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteTask}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
    </RequireAuth>
  );
}