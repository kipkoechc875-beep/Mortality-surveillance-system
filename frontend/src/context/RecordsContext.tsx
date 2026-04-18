import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface RecordModel {
  id: number;
  user_id: number;
  name: string;
  age: number;
  sex: string;
  cause_of_death: string;
  location: string;
  date_of_death: string;
  created_at: string;
}

interface RecordsContextType {
  records: RecordModel[];
  addRecord: (record: Omit<RecordModel, "id" | "user_id" | "created_at">) => Promise<void>;
  updateRecord: (id: number, record: Omit<RecordModel, "id" | "user_id" | "created_at">) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  loading: boolean;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecords = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/deaths', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: Omit<RecordModel, "id" | "user_id" | "created_at">) => {
    try {
      const res = await fetch('/api/deaths', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(record)
      });
      if (res.ok) {
        await fetchRecords(); // Refresh records
      }
    } catch (error) {
      console.error('Failed to add record:', error);
    }
  };

  const updateRecord = async (id: number, record: Omit<RecordModel, "id" | "user_id" | "created_at">) => {
    try {
      const res = await fetch(`/api/deaths/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(record)
      });
      if (res.ok) {
        await fetchRecords(); // Refresh records
      }
    } catch (error) {
      console.error('Failed to update record:', error);
    }
  };

  const deleteRecord = async (id: number) => {
    try {
      const res = await fetch(`/api/deaths/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  return (
    <RecordsContext.Provider value={{ records, addRecord, updateRecord, deleteRecord, loading }}>
      {children}
    </RecordsContext.Provider>
  );
}

export function useRecords() {
  const context = useContext(RecordsContext);
  if (context === undefined) {
    throw new Error("useRecords must be used within a RecordsProvider");
  }
  return context;
}
