import { format } from "date-fns";
import { Activity, ArrowLeft, Calendar, Clock, FileText, MapPin, Trash2, User } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useRecords } from "@/context/RecordsContext";
import { useToast } from "@/hooks/use-toast";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function RecordDetail() {
  const [, params] = useRoute("/records/:id");
  const id = params?.id;
  const { records, deleteRecord } = useRecords();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { user } = useAuth();
  const record = records.find((entry) => entry.id === id);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Record Not Found</h2>
        <p className="text-muted-foreground">
          The record you&apos;re looking for does not exist or has been deleted.
        </p>
        <Button asChild>
          <Link href="/records">Return to Records</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteRecord(parseInt(record.id));
      toast({
        title: "Record deleted",
        description: "The record has been permanently removed.",
        variant: "destructive",
      });
      setLocation("/records");
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete record. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/records" data-testid="link-back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Record {record.id}</h2>
      </div>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="text-xl">Deceased Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="mr-2 h-4 w-4" /> Full Name
              </div>
              <div className="text-lg font-medium">{record.name}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="mr-2 h-4 w-4" /> Demographics
              </div>
              <div className="text-lg font-medium">{record.age} years / {record.sex}</div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <Separator className="my-2" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Activity className="mr-2 h-4 w-4" /> Cause of Death
              </div>
              <div className="text-lg font-medium text-primary">{record.cause_of_death}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" /> Hospital Location
              </div>
              <div className="text-lg font-medium">{record.location}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" /> Date of Death
              </div>
              <div className="text-lg font-medium">{format(new Date(record.date_of_death), "MMMM dd, yyyy")}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start justify-between gap-4 border-t border-border bg-muted/30 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            System entry: {format(new Date(record.created_at), "MMM dd, yyyy HH:mm")}
          </div>

            {user?.role === "admin" ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" data-testid="button-delete-record">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Record</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the record for {record.name}? This action cannot be undone and will
                    remove the data from all reports.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    data-testid="button-confirm-delete"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div className="rounded-md border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              Delete access is reserved for admin accounts.
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
