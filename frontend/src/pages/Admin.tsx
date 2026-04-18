import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AdminUser = {
  id: number;
  username: string;
  role: "user" | "admin";
  is_active: 0 | 1;
};

export default function Admin() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function fetchUsers() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/users", {
          headers: {
            Authorization: token!,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg = errorData.message || `HTTP ${response.status}`;
          throw new Error(errorMsg);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users:", err);
        setError((err as Error).message || "Unable to fetch users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [token]);

  const refreshUsers = async () => {
    if (!token) return;

    const response = await fetch("/api/users", {
      headers: {
        Authorization: token!,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setUsers(await response.json());
    }
  };

  const toggleUserActive = async (id: number, isActive: number) => {
    await fetch(`/api/users/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: token!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_active: isActive ? 0 : 1 }),
    });
    refreshUsers();
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) {
      return;
    }

    await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token!,
        "Content-Type": "application/json",
      },
    });
    refreshUsers();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin User Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.username}. Here you can view all users, their roles, and enable, disable or delete accounts.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-background p-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage user access and account status for the surveillance system.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background p-6">
              <h2 className="text-xl font-semibold">Account Controls</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enable or disable user accounts and remove inactive or unauthorized users.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Loading users...</div>
          ) : error ? (
            <div className="p-6 text-center text-sm text-destructive">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userEntry) => (
                  <TableRow key={userEntry.id}>
                    <TableCell>{userEntry.id}</TableCell>
                    <TableCell>{userEntry.username}</TableCell>
                    <TableCell>{userEntry.role}</TableCell>
                    <TableCell>
                      {userEntry.is_active ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          Disabled
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleUserActive(userEntry.id, userEntry.is_active)}
                        >
                          {userEntry.is_active ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(userEntry.id)}
                          disabled={userEntry.id === user?.id}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
