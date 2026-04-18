import { useMemo, useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Download, Eye, Search, Trash2, Edit } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Records() {
  const { records, updateRecord } = useRecords();
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sexFilter, setSexFilter] = useState<string>("all");
  const [causeFilter, setCauseFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    sex: "",
    cause_of_death: "",
    location: "",
    date_of_death: "",
  });

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

  const handleDelete = async (id: number) => {
    await deleteRecord(id);
    toast({
      title: "Record deleted",
      description: "The record has been permanently removed.",
      variant: "destructive",
    });
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setEditForm({
      name: record.name,
      age: record.age.toString(),
      sex: record.sex,
      cause_of_death: record.cause_of_death,
      location: record.location,
      date_of_death: record.date_of_death,
    });
  };

  const handleSaveEdit = async () => {
    if (editingRecord) {
      await updateRecord(editingRecord.id, {
        name: editForm.name,
        age: parseInt(editForm.age),
        sex: editForm.sex,
        cause_of_death: editForm.cause_of_death,
        location: editForm.location,
        date_of_death: editForm.date_of_death,
      });
      setEditingRecord(null);
      toast({
        title: "Record updated",
        description: "The record has been updated successfully.",
      });
    }
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
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(record)}>
                        <Edit className="h-4 w-4" />
                      </Button>

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

      <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sex" className="text-right">
                Sex
              </Label>
              <Select value={editForm.sex} onValueChange={(value) => setEditForm({ ...editForm, sex: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cause" className="text-right">
                Cause
              </Label>
              <Select value={editForm.cause_of_death} onValueChange={(value) => setEditForm({ ...editForm, cause_of_death: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAUSES.map((cause) => (
                    <SelectItem key={cause} value={cause}>
                      {cause}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Select value={editForm.location} onValueChange={(value) => setEditForm({ ...editForm, location: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date of Death
              </Label>
              <Input
                id="date"
                type="date"
                value={editForm.date_of_death}
                onChange={(e) => setEditForm({ ...editForm, date_of_death: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setEditingRecord(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
