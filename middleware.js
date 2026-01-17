import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect here if not logged in
  },
});

export const config = {
  matcher: ["/admin/:path*"], // Protect the admin folder
};