import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { RecordModel, MOCK_RECORDS } from "@/lib/mock-data";

interface RecordsContextType {
  records: RecordModel[];
  addRecord: (record: Omit<RecordModel, "id" | "created_at" | "owner">) => void;
  updateRecord: (id: string, updates: Partial<Omit<RecordModel, "id" | "created_at" | "owner">>) => void;
  deleteRecord: (id: string) => void;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [records, setRecords] = useState<RecordModel[]>(MOCK_RECORDS);

  const visibleRecords = useMemo(() => {
    if (user?.role === "admin") {
      return records;
    }

    if (!user) {
      return [];
    }

    return records.filter((record) => record.owner === user.username);
  }, [records, user]);

  const addRecord = (record: Omit<RecordModel, "id" | "created_at" | "owner">) => {
    const owner = user?.username || "guest";
    const newRecord: RecordModel = {
      ...record,
      id: `REC-${1000 + records.length + 1}`,
      owner,
      created_at: new Date().toISOString(),
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const updateRecord = (id: string, updates: Partial<Omit<RecordModel, "id" | "created_at" | "owner">>) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? {
              ...record,
              ...updates,
            }
          : record
      )
    );
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RecordsContext.Provider value={{ records: visibleRecords, addRecord, updateRecord, deleteRecord }}>
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
