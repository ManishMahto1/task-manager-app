'use client';

import React from 'react';
import { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import Spinner from './Spinner';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onTaskUpdate: (task: Task) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  loading = false, 
  onTaskUpdate, 
  onTaskDelete 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="large" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg  text-center">
        <p className="text-gray-500">No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default TaskList;