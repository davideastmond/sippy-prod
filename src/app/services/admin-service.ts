export const AdminService = {
  async setAuthenticatedUserAsAdmin({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const req = await fetch("/api/auth/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!req.ok) {
      throw new Error("Failed to set authenticated user as admin");
    }
  },
};
