import { createContext, useContext, useState, ReactNode } from "react";
import { RecordModel, MOCK_RECORDS } from "@/lib/mock-data";

interface RecordsContextType {
  records: RecordModel[];
  addRecord: (record: Omit<RecordModel, "id" | "created_at">) => void;
  deleteRecord: (id: string) => void;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<RecordModel[]>(MOCK_RECORDS);

  const addRecord = (record: Omit<RecordModel, "id" | "created_at">) => {
    const newRecord: RecordModel = {
      ...record,
      id: `REC-${1000 + records.length + 1}`,
      created_at: new Date().toISOString(),
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RecordsContext.Provider value={{ records, addRecord, deleteRecord }}>
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
