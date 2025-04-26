import Users from "@/db/users";
import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const filePath = path.join(process.cwd(), '/db/users.json');
    let users = [];

    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      users = JSON.parse(fileData);
    } catch {
      return new Response(
        JSON.stringify({ message: 'No users found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = users.find((user) => user.email === email);

    if (!user || user.password !== password) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Sign-in successful', user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error during sign-in:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  }
