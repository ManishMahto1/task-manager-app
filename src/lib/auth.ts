import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/User';
import dbConnect from './db';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface TokenPayload {
  userId: string;
  email: string;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<IUser | null> {
  await dbConnect();
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) return null;
  
  const isPasswordValid = await user.comparePassword(password);
  return isPasswordValid ? user : null;
}

export function generateToken(user: IUser): string {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch  {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return request.cookies.get('token')?.value || null;
}

export async function getCurrentUser(request: NextRequest): Promise<IUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const payload = verifyToken(token);
  if (!payload) return null;
  
  await dbConnect();
  return User.findById(payload.userId);
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}