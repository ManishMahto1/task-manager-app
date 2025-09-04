// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;
    
    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
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
      { status: 200 }
    );
    
    setAuthCookie(response, token);
    return response;
  } catch {
    //console.error('Login error:', error);
    
   
       

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}