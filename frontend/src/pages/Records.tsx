import { useMemo, useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Download, Eye, Search, Trash2 } from "lucide-react";
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

export default function Records() {
  const { records, deleteRecord } = useRecords();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sexFilter, setSexFilter] = useState<string>("all");
  const [causeFilter, setCauseFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        record.name.toLowerCase().includes(searchLower) ||
        record.cause_of_death.toLowerCase().includes(searchLower) ||
        record.location.toLowerCase().includes(searchLower) ||
        record.id.toLowerCase().includes(searchLower);

      const matchesSex = sexFilter === "all" || record.sex === sexFilter;
      const matchesCause = causeFilter === "all" || record.cause_of_death === causeFilter;
      const matchesLocation = locationFilter === "all" || record.location === locationFilter;

      return matchesSearch && matchesSex && matchesCause && matchesLocation;
    });
  }, [records, search, sexFilter, causeFilter, locationFilter]);

  const handleDelete = (id: string) => {
    deleteRecord(id);
    toast({
      title: "Record deleted",
      description: "The record has been permanently removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold tracking-tight">Records Database</h2>
        <Button variant="outline" data-testid="button-export">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, ID, location..."
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
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <TableHead>Location</TableHead>
                <TableHead>Date of Death</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} data-testid={`row-record-${record.id}`}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.age} / {record.sex}</TableCell>
                  <TableCell>{record.cause_of_death}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={record.location}>
                    {record.location}
                  </TableCell>
                  <TableCell>{format(new Date(record.date_of_death), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" title="View details">
                        <Link href={`/records/${record.id}`} data-testid={`button-view-${record.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
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
