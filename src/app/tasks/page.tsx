/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Task, TaskFormData, TaskFilters } from '@/lib/types';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import SearchBar from '@/components/SearchBar';
import Spinner from '@/components/Spinner';
import { FiPlus, FiLogOut, FiUser, FiBell, FiCalendar, FiFilter } from 'react-icons/fi';

export default function TasksPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, filters]);

  useEffect(() => {
    // Calculate statistics
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    setStats({ total, completed, pending });
    
    // Apply additional client-side filtering if needed
    let result = tasks;
    
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    if (filters.completed !== undefined) {
      result = result.filter(task => task.completed === filters.completed);
    }
    
    setFilteredTasks(result);
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.dueDate) queryParams.append('dueDate', filters.dueDate);
      
      const response = await fetch(`/api/tasks?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      const data = await response.json();
      setTasks([data.task, ...tasks]);
      setShowTaskForm(false);
      
      // Show success notification
      setError('');
      setTimeout(() => {
        // Clear any success message after 3 seconds
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const data = await response.json();
      setTasks(tasks.map(t => t._id === task._id ? data.task : t));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    }
  };

  const clearError = () => setError('');

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Spinner size="large" className="text-blue-600" />
          
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiCalendar className="text-blue-600" />
              My Tasks
            </h1>
            <p className="text-gray-600 mt-1">Stay organized and productive</p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2">
              <FiUser className="text-blue-600" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiBell className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              <p className="text-gray-600">Total Tasks</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FiCalendar className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.completed}</h3>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <FiFilter className="text-orange-600 text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
              <p className="text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex justify-between items-center">
            <p>{error}</p>
            <button onClick={clearError} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FiFilter />
              Filter Tasks
            </h2>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
            >
              <FiPlus />
              {showTaskForm ? 'Cancel' : 'Add New Task'}
            </button>
          </div>
          
          <SearchBar 
            filters={filters} 
            onFiltersChange={setFilters} 
            loading={loading}
          />
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
            <TaskForm 
              onSubmit={handleCreateTask} 
              onCancel={() => setShowTaskForm(false)}
              loading={loading}
            />
          </div>
        )}

        {/* Task List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="large" className="text-blue-600" />
            </div>
          ) : (
            <TaskList 
              tasks={filteredTasks} 
              loading={loading}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
            />
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredTasks.length === 0 && tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first task</p>
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Create Task
            </button>
          </div>
        )}

        {!loading && filteredTasks.length === 0 && tasks.length > 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiFilter className="text-gray-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks match your filters</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}