import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { RecordModel } from "@/lib/mock-data";

interface RecordsContextType {
  records: RecordModel[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  addRecord: (record: Omit<RecordModel, "id" | "created_at" | "user_id">) => Promise<void>;
  updateRecord: (id: number, updates: Partial<Omit<RecordModel, "id" | "created_at" | "user_id">>) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  refreshRecords: () => Promise<void>;
  markAllRead: () => Promise<void>;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [records, setRecords] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchRecords = async () => {
    if (!token) {
      setRecords([]);
      setLoading(false);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/deaths", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      // Transform backend data to match frontend RecordModel
      const transformedRecords: RecordModel[] = data.map((record: any) => ({
        ...record,
        id: record.id.toString(), // Convert id to string for frontend compatibility
        owner: user?.username || "unknown", // Add owner field for compatibility
        is_read: record.is_read ?? 1,
      }));
      setRecords(transformedRecords);
      setUnreadCount(
        user?.role === "admin"
          ? transformedRecords.filter((record) => record.is_read === 0).length
          : 0
      );
    } catch (err) {
      console.error("Failed to fetch records:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user, token]);

  const addRecord = async (record: Omit<RecordModel, "id" | "created_at" | "user_id">) => {
    if (!token) throw new Error("Not authenticated");

    const response = await fetch("/api/deaths", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add record");
    }

    await fetchRecords(); // Refresh records after adding
  };

  const updateRecord = async (id: number, updates: Partial<Omit<RecordModel, "id" | "created_at" | "user_id">>) => {
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`/api/deaths/${id}`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update record");
    }

    await fetchRecords(); // Refresh records after updating
  };

  const deleteRecord = async (id: number) => {
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`/api/deaths/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete record");
    }

    await fetchRecords(); // Refresh records after deleting
  };

  const markAllRead = async () => {
    if (!token) return;

    const response = await fetch("/api/deaths/mark-read", {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to mark records as read");
    }

    await fetchRecords();
  };

  const refreshRecords = async () => {
    await fetchRecords();
  };

  const value = {
    records,
    loading,
    error,
    unreadCount,
    addRecord,
    updateRecord,
    deleteRecord,
    refreshRecords,
    markAllRead,
  };

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecords() {
  const context = useContext(RecordsContext);
  if (context === undefined) {
    throw new Error("useRecords must be used within a RecordsProvider");
  }
  return context;
}
