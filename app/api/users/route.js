import Users from "@/db/users";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const { email } = body;
  const { password } = body;

  const user = Users.some(
    (user) => user.email === email && user.password === password
  );
  
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const theUser = Users.find(
    (user) => user.email === email && user.password === password
  );
  
  return NextResponse.json(theUser);
};
