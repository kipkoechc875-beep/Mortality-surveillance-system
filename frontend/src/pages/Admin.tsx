import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

type AdminUser = {
  id: number;
  username: string;
  role: "user" | "admin";
  is_active: 0 | 1;
};

type HospitalLocation = {
  id: number;
  name: string;
};

export default function Admin() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [locations, setLocations] = useState<HospitalLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newLocationName, setNewLocationName] = useState("");
  const [addingLocation, setAddingLocation] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function fetchUsersAndLocations() {
      setLoading(true);
      setError(null);

      try {
        // Fetch users
        const usersResponse = await fetch("/api/users", {
          headers: {
            Authorization: token!,
            "Content-Type": "application/json",
          },
        });

        if (!usersResponse.ok) {
          const errorData = await usersResponse.json().catch(() => ({}));
          const errorMsg = errorData.message || `HTTP ${usersResponse.status}`;
          throw new Error(errorMsg);
        }

        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch locations
        const locationsResponse = await fetch("/api/locations", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (locationsResponse.ok) {
          const locationsData = await locationsResponse.json();
          setLocations(locationsData);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError((err as Error).message || "Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsersAndLocations();
  }, [token]);

  const refreshData = async () => {
    if (!token) return;

    const usersResponse = await fetch("/api/users", {
      headers: {
        Authorization: token!,
        "Content-Type": "application/json",
      },
    });
    if (usersResponse.ok) {
      setUsers(await usersResponse.json());
    }

    const locationsResponse = await fetch("/api/locations", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (locationsResponse.ok) {
      setLocations(await locationsResponse.json());
    }
  };

  const addLocation = async () => {
    if (!newLocationName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a hospital location name",
        variant: "destructive",
      });
      return;
    }

    setAddingLocation(true);
    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          Authorization: token!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newLocationName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Hospital location added successfully",
      });

      setNewLocationName("");
      await refreshData();
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message || "Failed to add hospital location",
        variant: "destructive",
      });
    } finally {
      setAddingLocation(false);
    }
  };

  const deleteLocation = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this hospital location?")) {
      return;
    }

    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token!,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Hospital location deleted successfully",
      });

      await refreshData();
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message || "Failed to delete hospital location",
        variant: "destructive",
      });
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
    refreshData();
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
    refreshData();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Management Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.username}. Here you can manage users, hospital locations, and system settings.
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
              <h2 className="text-xl font-semibold">Hospital Locations</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Add, view, and manage hospital locations for death records.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hospital Locations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter hospital location name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addLocation()}
              disabled={addingLocation}
            />
            <Button onClick={addLocation} disabled={addingLocation}>
              {addingLocation ? "Adding..." : "Add Location"}
            </Button>
          </div>

          <div className="mt-4">
            {locations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hospital locations added yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>{location.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteLocation(location.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
                          disabled={userEntry.id === user?.id}
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
