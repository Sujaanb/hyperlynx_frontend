import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Plus, Check, X, ArrowLeft, ClipboardCheck } from 'lucide-react';
import { hyperlynxApi } from '../services/hyperlynxApi';

interface ActionPlanTask {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const priorityColors: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  high: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  low: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
};

const statusColors: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
};

export function GrcActionPlan() {
  const [tasks, setTasks] = useState<ActionPlanTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ActionPlanTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchActionPlan();
  }, []);

  const fetchActionPlan = async () => {
    try {
      setLoading(true);
      const data = await hyperlynxApi.getActionPlan();
      setTasks(data.results || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load action plan');
      console.error('Action plan fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hyperlynxApi.generateIntelligenceActionPlan();
      setFormData({ title: '', description: '', dueDate: '' });
      setShowCreateForm(false);
      await fetchActionPlan();
    } catch (err) {
      console.error('Create task error:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: 'todo' | 'in_progress' | 'done') => {
    try {
      setUpdatingTaskId(taskId);
      await hyperlynxApi.updateActionPlanTask(taskId, newStatus);
      await fetchActionPlan();
    } catch (err) {
      console.error('Update task error:', err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const completionRate = tasks.length > 0 ? Math.round((tasksByStatus.done.length / tasks.length) * 100) : 0;

  const handlePopulate = async () => {
    await hyperlynxApi.generateIntelligenceActionPlan();
    await fetchActionPlan();
  };

  const getOverdueCount = () => {
    const today = new Date();
    return tasks.filter((t) => t.status !== 'done' && new Date(t.due_date) < today).length;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getDaysUntilDue = (dateString: string) => {
    try {
      const today = new Date();
      const dueDate = new Date(dateString);
      const days = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return days;
    } catch {
      return 0;
    }
  };

  if (selectedTask) {
    const daysUntilDue = getDaysUntilDue(selectedTask.due_date);
    const isOverdue = daysUntilDue < 0 && selectedTask.status !== 'done';
    const suggestedControls = [
      `Break down '${selectedTask.title}' into owner-assigned sub-tasks.`,
      'Add measurable completion criteria for audit evidence.',
      'Track weekly progress and blockers in governance meeting.',
      selectedTask.priority === 'critical' || selectedTask.priority === 'high'
        ? 'Escalate status to leadership until mitigation is complete.'
        : 'Schedule implementation in upcoming sprint cycle.',
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Detailed Action Item</h1>
            <p className="text-gray-600 text-sm mt-1">{selectedTask.title}</p>
          </div>
          <button
            onClick={() => setSelectedTask(null)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Action Plan
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">{selectedTask.title}</p>
            <div className="flex gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded ${priorityColors[selectedTask.priority].bg} ${priorityColors[selectedTask.priority].text}`}>
                {selectedTask.priority}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[selectedTask.status]}`}>
                {selectedTask.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="text-base font-semibold text-gray-900 mt-1">{formatDate(selectedTask.due_date)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Timeline</p>
              <p className={`text-base font-semibold mt-1 ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` : `Due in ${daysUntilDue} days`}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Execution Status</p>
              <p className="text-base font-semibold text-gray-900 mt-1">{selectedTask.status === 'done' ? 'Completed' : 'Active'}</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Task Description</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTask.description || 'No description provided.'}</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-green-600" /> Recommended Controls / Steps
            </p>
            <ul className="space-y-2">
              {suggestedControls.map((item, idx) => (
                <li key={`${selectedTask.id}-${idx}`} className="text-sm text-gray-700 flex gap-2">
                  <span className="font-bold text-green-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Action Plan</h1>
          <p className="text-gray-600 text-sm mt-1">Track remediation tasks and compliance activities</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
        <button
          onClick={handlePopulate}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition text-sm font-medium"
        >
          Populate from Analysis
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error loading action plan</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{tasksByStatus.in_progress.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{tasksByStatus.done.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{getOverdueCount()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Create New Task</h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Implement MFA for all users"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add details about this task..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task Lists by Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(
          [
            { status: 'todo', title: 'To Do', icon: AlertCircle, color: 'text-gray-600' },
            { status: 'in_progress', title: 'In Progress', icon: Clock, color: 'text-blue-600' },
            { status: 'done', title: 'Completed', icon: CheckCircle2, color: 'text-green-600' },
          ] as const
        ).map(({ status, title, icon: Icon }) => (
          <div key={status} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Icon className={`h-5 w-5 ${Icon === CheckCircle2 ? 'text-green-600' : Icon === Clock ? 'text-blue-600' : 'text-gray-600'}`} />
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <span className="ml-auto text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {tasksByStatus[status].length}
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tasksByStatus[status].length > 0 ? (
                tasksByStatus[status].map((task) => {
                  const daysUntilDue = getDaysUntilDue(task.due_date);
                  const isOverdue = daysUntilDue < 0 && status !== 'done';

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        isOverdue
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-100 hover:bg-gray-50'
                      } transition cursor-pointer`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${priorityColors[task.priority].dot}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100">
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text} w-fit`}>
                            {task.priority}
                          </span>
                          <p className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                            {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` : `Due in ${daysUntilDue} days`}
                          </p>
                        </div>

                        {status !== 'done' && (
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleUpdateTaskStatus(
                                task.id,
                                e.target.value as 'todo' | 'in_progress' | 'done'
                              )
                            }
                            disabled={updatingTaskId === task.id}
                            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Complete</option>
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <Icon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
