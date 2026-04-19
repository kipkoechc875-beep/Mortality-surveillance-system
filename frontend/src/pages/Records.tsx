import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Download, Edit3, Eye, Search, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRecords } from "@/context/RecordsContext";
import { useToast } from "@/hooks/use-toast";
import { CAUSES, LOCATIONS } from "@/lib/mock-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Records() {
  const { records, deleteRecord, markAllRead } = useRecords();
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sexFilter, setSexFilter] = useState<string>("all");
  const [causeFilter, setCauseFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [locations, setLocations] = useState<string[]>(LOCATIONS);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("excel");

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchLower = search.toLowerCase();
      const recordId = String(record.id).toLowerCase();
      const recordLocation = String(record.location).toLowerCase();
      const matchesSearch =
        record.name.toLowerCase().includes(searchLower) ||
        record.cause_of_death.toLowerCase().includes(searchLower) ||
        recordLocation.includes(searchLower) ||
        recordId.includes(searchLower);

      const matchesSex = sexFilter === "all" || record.sex === sexFilter;
      const matchesCause = causeFilter === "all" || record.cause_of_death === causeFilter;
      const matchesLocation = locationFilter === "all" || record.location === locationFilter;
      const recordDate = record.created_at ? new Date(record.created_at) : null;

      const isAfterFrom = !dateFrom ||
        (recordDate && new Date(recordDate.setHours(0, 0, 0, 0)) >= new Date(dateFrom));
      const toDate = dateTo ? new Date(dateTo) : null;
      const dateToEnd = toDate ? new Date(toDate.setHours(23, 59, 59, 999)) : null;
      const isBeforeTo = !dateTo ||
        (recordDate && dateToEnd && recordDate <= dateToEnd);

      return matchesSearch && matchesSex && matchesCause && matchesLocation && isAfterFrom && isBeforeTo;
    });
  }, [records, search, sexFilter, causeFilter, locationFilter, dateFrom, dateTo]);

  const handleDelete = async (id: string) => {
    try {
      await deleteRecord(parseInt(id));
      toast({
        title: "Record deleted",
        description: "The record has been permanently removed.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportRows = () => {
    const rows = filteredRecords.map((record) => ({
      ID: record.id,
      Name: record.name,
      "Age / Sex": `${record.age} / ${record.sex}`,
      "Cause of Death": record.cause_of_death,
      "Hospital Location": record.location,
      "Date of Death": record.date_of_death,
      "Created At": record.created_at,
    }));

    return rows;
  };

  const downloadCSV = (data: Array<Record<string, any>>) => {
    const csvRows = [];
    const headers = Object.keys(data[0] || {});
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        const escaped = typeof value === "string" ? value.replace(/"/g, '""') : value;
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mortality-report-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = (data: Array<Record<string, any>>) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 15;

    // Add logo at top center
    const logoSize = 20;
    const logoX = (pageWidth - logoSize) / 2;
    doc.addImage("/logo.png", "PNG", logoX, 8, logoSize, 12);

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(31, 41, 55); // Near-black text (primary/foreground)
    doc.text("Mortality Surveillance Report", pageWidth / 2, currentY + 15, { align: "center" });

    // Add export date
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // Muted foreground
    doc.text(
      `Exported: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      currentY + 22,
      { align: "center" }
    );

    currentY = 45; // Add extra spacing below the header and logo

    // Add table data
    const headers = Object.keys(data[0] || {});
    const rows = data.map((row) => headers.map((header) => String(row[header]).substring(0, 50)));

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: currentY,
      margin: { left: 10, right: 10, top: currentY },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        halign: "left",
        valign: "middle",
        lineColor: [226, 232, 240], // Subtle border color
        lineWidth: 0.3,
        textColor: [31, 41, 55], // Foreground text
      },
      headStyles: {
        fillColor: [59, 130, 246], // Primary blue
        textColor: [255, 255, 255], // White text on blue
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Very light blue (almost white)
      },
      rowPageBreak: "avoid",
      pageBreak: "auto",
    });

    // Add signature area
    const finalY = Math.min(doc.lastAutoTable.finalY + 20, pageHeight - 45);

    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);

    // Signature label
    doc.text("Admin Signature and Date:", 15, finalY);

    // Draw signature line
    const lineX1 = 15;
    const lineX2 = 70;
    const lineY = finalY + 15;
    doc.setDrawColor(100, 116, 139); // Slate color for line
    doc.line(lineX1, lineY, lineX2, lineY);

    // Date label
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text("Date", lineX1, lineY + 8);

    // Certification text at bottom
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    const certText =
      "This report has been generated from the Mortality Surveillance System for official use.";
    doc.text(certText, 15, pageHeight - 12, { maxWidth: pageWidth - 30 });

    // Save PDF
    doc.save(`mortality-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleExport = () => {
    const rows = exportRows();
    if (!rows.length) {
      toast({
        title: "No records to export",
        description: "Adjust the filters or date range before exporting.",
      });
      return;
    }

    if (exportFormat === "excel") {
      downloadCSV(rows);
    } else {
      downloadPDF(rows);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      markAllRead().catch(() => {
        /* ignore */
      });
    }
  }, [user]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch("/api/locations");
        if (!response.ok) {
          throw new Error("Unable to load hospital locations");
        }
        const data = await response.json();
        setLocations(data.map((item: { name: string }) => item.name));
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    }

    fetchLocations();
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Records Database</h2>
          {user?.role === "admin" ? (
            <p className="text-sm text-muted-foreground">Export reports for a custom record date range or hospital location.</p>
          ) : (
            <p className="text-sm text-muted-foreground">View and filter your submitted mortality records.</p>
          )}
        </div>

        {user?.role === "admin" && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as "pdf" | "excel")}> 
              <SelectTrigger className="min-w-[160px]" data-testid="export-format">
                <SelectValue placeholder="Export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleExport} data-testid="button-export">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, ID, hospital location..."
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                data-testid="input-search"
              />
            </div>

            <Select value={sexFilter} onValueChange={setSexFilter}>
              <SelectTrigger data-testid="filter-sex">
                <SelectValue placeholder="Filter by Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sexes</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={causeFilter} onValueChange={setCauseFilter}>
              <SelectTrigger data-testid="filter-cause">
                <SelectValue placeholder="Filter by Cause" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Causes</SelectItem>
                {CAUSES.map((cause) => (
                  <SelectItem key={cause} value={cause}>
                    {cause}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger data-testid="filter-location">
                <SelectValue placeholder="Filter by Hospital Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hospital Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Record Date From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                data-testid="filter-date-from"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Record Date To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                data-testid="filter-date-to"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age / Sex</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Hospital Location</TableHead>
                <TableHead>Date of Death</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} data-testid={`row-record-${record.id}`}>
                  <TableCell className="font-medium">
                    {record.id}
                    {user?.role === "admin" && record.is_read === 0 ? (
                      <span className="ml-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
                        New
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.age} / {record.sex}</TableCell>
                  <TableCell>{record.cause_of_death}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={record.location}>
                    {record.location}
                  </TableCell>
                  <TableCell>{format(new Date(record.date_of_death), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(new Date(record.created_at), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" title="View details">
                        <Link href={`/records/${record.id}`} data-testid={`button-view-${record.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      {user?.role === "admin" && (
                        <Button asChild variant="ghost" size="icon" title="Edit record">
                          <Link href={`/records/${record.id}/edit`} data-testid={`button-edit-${record.id}`}>
                            <Edit3 className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}

                      {user?.role === "admin" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              title="Delete"
                              data-testid={`button-delete-${record.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Record</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the record for {record.name}? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(record.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <span className="text-xs text-muted-foreground">Admin only</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    No records found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-right text-sm text-muted-foreground">Showing {filteredRecords.length} records</div>
    </div>
  );
}
