// models/Task.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for better query performance
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, completed: 1, dueDate: 1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);