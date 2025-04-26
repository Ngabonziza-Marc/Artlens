import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const filePath = path.join(process.cwd(), '/db/users.json');
    let users = [];

    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      users = JSON.parse(fileData);
    } catch {
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    users.push({ name, email, password });

    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');

    return new Response(JSON.stringify({ message: 'User saved successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error saving user:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
