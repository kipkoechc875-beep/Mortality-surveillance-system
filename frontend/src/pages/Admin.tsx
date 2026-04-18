import { useAuth } from "@/context/AuthContext";

export default function Admin() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Welcome back, {user?.username}. Use the admin tools below to manage users and system access.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create and manage user accounts, assign roles, and control who can submit mortality records.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold">System Oversight</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Review active users, monitor record submissions, and keep system access aligned with policy.
          </p>
        </div>
      </div>
    </div>
  );
}
