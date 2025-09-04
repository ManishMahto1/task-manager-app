// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import Task from '@/models/Task';
import dbConnect from '@/lib/db';
import { taskSchema } from '@/lib/validators';

// GET /api/tasks - Get all tasks for the current user with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const completed = searchParams.get('completed');
    const priority = searchParams.get('priority');
    const dueDate = searchParams.get('dueDate');
    
    // Build filter object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { user: user._id };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (completed !== null) {
      filter.completed = completed === 'true';
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (dueDate) {
      const date = new Date(dueDate);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      filter.dueDate = {
        $gte: date,
        $lt: nextDay,
      };
    }
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validatedData = taskSchema.parse(body);
    
    const task = await Task.create({
      ...validatedData,
      user: user._id,
    });
    
    return NextResponse.json({ task }, { status: 201 });
  } catch  {
   // console.error('Create task error:', error);
    
    
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}