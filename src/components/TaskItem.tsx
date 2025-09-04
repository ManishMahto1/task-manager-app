'use client';

import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { FiEdit3, FiTrash2, FiCheck, FiClock, FiCalendar, FiX, FiCheckCircle, FiCircle } from 'react-icons/fi';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete, loading = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [editCompleted, setEditCompleted] = useState(task.completed);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    const dueDateValue = editDueDate ? new Date(editDueDate) : undefined;
    
    await onUpdate({
      ...task,
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      dueDate: dueDateValue,
      completed: editCompleted,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setEditCompleted(task.completed);
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    await onUpdate({
      ...task,
      completed: !task.completed,
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task._id);
    setIsDeleting(false);
  };

  const priorityConfig = {
    low: { color: 'bg-green-100 text-green-800 border-green-200', icon: '🟢' },
    medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🟡' },
    high: { color: 'bg-red-100 text-red-800 border-red-200', icon: '🔴' },
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Task</h3>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              checked={editCompleted}
              onChange={(e) => setEditCompleted(e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label className="text-sm font-medium text-gray-900">Mark as completed</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !editTitle.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiCheck size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-4 transition-all duration-300 hover:shadow-xl
      ${task.completed ? 'opacity-75' : 'opacity-100'}
      ${isOverdue ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-500'}
      animate-fade-in
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className={`p-2 rounded-full mt-1 transition-all duration-200 ${
              task.completed
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {task.completed ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`
              text-lg font-semibold break-words
              ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
            `}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityConfig[task.priority].color}`}>
          {task.priority}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
              <FiClock size={14} />
              <span>Due: {formatDate(new Date(task.dueDate))}</span>
              {isOverdue && <span className="ml-1">(Overdue)</span>}
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <FiCalendar size={14} />
            <span>Created: {formatDate(new Date(task.createdAt))}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => setIsEditing(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          <FiEdit3 size={16} />
          Edit
        </button>
        
        <button
          onClick={handleToggleComplete}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 text-sm font-medium ${
            task.completed
              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          {task.completed ? (
            <>
              <FiX size={16} />
              Mark Incomplete
            </>
          ) : (
            <>
              <FiCheck size={16} />
              Complete
            </>
          )}
        </button>
        
        <button
          onClick={handleDelete}
          disabled={loading || isDeleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 text-sm font-medium ml-auto"
        >
          {isDeleting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
          ) : (
            <FiTrash2 size={16} />
          )}
          Delete
        </button>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px) scale(0.98); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TaskItem;