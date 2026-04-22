import { useEffect, useState } from "react";
import { useRecords } from "@/context/RecordsContext";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
  date_of_death: z.date({
    required_error: "A date of death is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddRecord() {
  const { addRecord } = useRecords();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [locations, setLocations] = useState<HospitalLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0,
      sex: undefined,
      cause_of_death: "",
      location: "",
      date_of_death: undefined,
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
    try {
      await addRecord({
        ...data,
        date_of_death: data.date_of_death.toISOString().split('T')[0], // Format as YYYY-MM-DD for database
      });

      toast({
        title: "Record added",
        description: "The mortality record has been successfully added to the system.",
      });

      setLocation("/records");
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to add record. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Add Death Record</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record Details</CardTitle>
          <CardDescription>
            Enter the official details of the deceased and the cause of death. All fields are required.
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingLocations}>
                        <FormControl>
                          <SelectTrigger data-testid="select-location">
                            <SelectValue placeholder={loadingLocations ? "Loading locations..." : "Select hospital location"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.length === 0 ? (
                            <SelectItem value="no-locations" disabled>
                              No locations available
                            </SelectItem>
                          ) : (
                            locations.map((loc) => (
                              <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>
                            ))
                          )}
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
                <Button type="submit" data-testid="button-submit">Save Record</Button>
                <Button type="button" variant="outline" onClick={() => form.reset()} data-testid="button-clear">
                  Clear Form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
