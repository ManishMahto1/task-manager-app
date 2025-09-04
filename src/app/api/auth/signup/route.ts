import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    const { email, password } = validatedData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = new User({ email, password });
    await user.save();
    
    // Generate token and set cookie
    const token = generateToken(user);
    
    const response = NextResponse.json(
      { 
        user: { 
          id: user._id, 
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        } 
      },
      { status: 201 }
    );
    
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    
  
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}