import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useRecords } from "@/context/RecordsContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

type HospitalLocation = {
  id: number;
  name: string;
};

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(0, "Age must be >= 0").max(120, "Age must be <= 120"),
  sex: z.enum(["Male", "Female", "Other"]),
  cause_of_death: z.string().min(1, "Cause of death is required"),
  location: z.string().min(1, "Location is required"),
  date_of_death: z.date({ required_error: "A date of death is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditRecord() {
  const [, params] = useRoute("/records/:id/edit");
  const id = params?.id;
  const { user } = useAuth();
  const { records, updateRecord } = useRecords();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [locations, setLocations] = useState<HospitalLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const record = useMemo(() => records.find((entry) => entry.id === id), [records, id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: record?.name ?? "",
      age: record?.age ?? 0,
      sex: record?.sex,
      cause_of_death: record?.cause_of_death ?? "",
      location: record?.location ?? "",
      date_of_death: record ? new Date(record.date_of_death) : undefined,
    },
  });

  // Fetch hospital locations on component mount
  useEffect(() => {
    async function fetchLocations() {
      try {
        setLoadingLocations(true);
        const response = await fetch("/api/locations", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        } else {
          console.error("Failed to fetch locations");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    }

    fetchLocations();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!record) {
      return;
    }

    try {
      await updateRecord(parseInt(record.id), {
        name: data.name,
        age: data.age,
        sex: data.sex,
        cause_of_death: data.cause_of_death,
        location: data.location,
        date_of_death: data.date_of_death.toISOString().split('T')[0], // Format as YYYY-MM-DD for database
      });

      toast({
        title: "Record updated",
        description: "The mortality record has been successfully updated.",
      });

      setLocation("/records");
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to update record. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-16 text-center">
        <h2 className="text-2xl font-bold">Access denied</h2>
        <p className="text-muted-foreground">Only admin accounts can edit records.</p>
        <Button asChild>
          <Link href="/records">Return to records</Link>
        </Button>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-16 text-center">
        <h2 className="text-2xl font-bold">Record not found</h2>
        <p className="text-muted-foreground">The record you are trying to edit does not exist.</p>
        <Button asChild>
          <Link href="/records">Return to records</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Edit Death Record</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Record</CardTitle>
          <CardDescription>
            Update the record details and save your changes. Admin edits ensure the system stays accurate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={120} {...field} data-testid="input-age" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-sex">
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cause_of_death"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cause of Death</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter cause of death"
                          {...field}
                          data-testid="input-cause"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital Location</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-location">
                            <SelectValue placeholder="Select hospital location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date_of_death"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Death</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="input-date"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button type="submit" data-testid="button-submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setLocation("/records")}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
