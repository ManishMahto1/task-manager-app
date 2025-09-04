import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import Task from '@/models/Task';
import dbConnect from '@/lib/db';
import { taskSchema } from '@/lib/validators';




export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
 

  if (!id) {
    return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const task = await Task.findOne({ _id: id, user: user._id });
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const validatedData = taskSchema.parse(body);
    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { ...validatedData, user: user._id },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ task: updatedTask });
  } catch {
    //console.error('Update task error:', error);
    
 
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
 

  if (!id) {
    return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const task = await Task.findOne({ _id: id, user: user._id });
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    await Task.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}