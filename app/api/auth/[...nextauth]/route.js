import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        // Here, implement your logic to validate the user credentials
        const user = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (credentials.email === email && credentials.password === password) {
          return user;
        }

        return null; // If user is not authenticated
      },
    }),
  ],
  session: {
    jwt: true,
  },
  pages: {
    signIn: "/signin", // Custom sign-in page
  },
});

export { handler as GET, handler as POST };
