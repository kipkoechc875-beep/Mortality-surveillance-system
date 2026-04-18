import { useAuth } from "@/context/AuthContext";

export default function Admin() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Welcome back, {user?.username}. Manage users and their access levels from this panel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold">User Accounts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage all user accounts, including roles and permissions.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-background p-6">
          <h2 className="text-xl font-semibold">Access Control</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Control user roles and ensure proper access to system features.
          </p>
        </div>
      </div>
    </div>
  );
}
