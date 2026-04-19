import { useRecords } from "@/context/RecordsContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "wouter";
import { format, isToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, PlusCircle, FileText, Users, MapPin } from "lucide-react";

export default function Dashboard() {
  const { records, loading, error } = useRecords();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading dashboard data: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // KPIs
  const totalRecords = records.length;
  const recordsToday = records.filter(r => isToday(new Date(r.created_at))).length;
  const maleCount = records.filter(r => r.sex === "Male").length;
  const femaleCount = records.filter(r => r.sex === "Female").length;
  
  // Most common cause
  const causeCounts = records.reduce((acc, curr) => {
    acc[curr.cause_of_death] = (acc[curr.cause_of_death] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonCause = Object.entries(causeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Chart data: Causes
  const causesData = Object.entries(causeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Chart data: Locations
  const locationCounts = records.reduce((acc, curr) => {
    acc[curr.location] = (acc[curr.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const locationsData = Object.entries(locationCounts).map(([name, value]) => ({ name, value }));

  // Chart data: Monthly trend
  const monthlyCounts = records.reduce((acc, curr) => {
    const month = format(new Date(curr.date_of_death), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const monthlyData = Object.entries(monthlyCounts)
    .map(([month, count]) => ({ month, count }))
    .reverse(); // simple reverse for chronological order

  // Color palette for causes of death - distinct and accessible colors
  const CAUSE_COLORS = {
    'Cardiovascular Disease': '#e41e10', // Red
    'Pneumonia': '#f39c12', // Orange
    'Road Traffic Accident': '#8e44ad', // Purple
    'Cancer': '#c0392b', // Dark Red
    'Sepsis': '#e74c3c', // Orange Red
    'Diabetes Complications': '#3498db', // Blue
    'Stroke': '#9b59b6', // Violet
    'Tuberculosis': '#16a085', // Teal
    'Malaria': '#d35400', // Burnt Orange
    'Measles': '#2ecc71', // Green
    'Typhoid': '#34495e', // Dark Blue-Gray
    'Dengue': '#f1c40f', // Yellow
    'Meningitis': '#e67e22', // Orange
    'Hepatitis': '#1abc9c', // Turquoise
    'HIV/AIDS': '#2c3e50', // Dark Gray
  } as Record<string, string>;

  // Function to get color for a cause of death
  const getCauseColor = (cause: string): string => {
    if (CAUSE_COLORS[cause]) {
      return CAUSE_COLORS[cause];
    }
    // Fallback: generate a consistent color based on cause name hash
    const hash = cause.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = Object.values(CAUSE_COLORS);
    return colors[hash % colors.length];
  };

  const LOCATION_COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#6b5b95', '#ff6f61', '#2a9d8f', '#f4a261', '#264653'];

  const getLocationColor = (location: string): string => {
    const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return LOCATION_COLORS[hash % LOCATION_COLORS.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {user?.role === "admin" ? "Dashboard Overview" : "Your Dashboard Overview"}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" data-testid="button-view-all">
            <Link href="/records">
              <FileText className="mr-2 h-4 w-4" /> View All
            </Link>
          </Button>
          <Button asChild data-testid="button-add-record">
            <Link href="/records/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Record
            </Link>
          </Button>
          {user?.role === "admin" && (
            <Button asChild variant="secondary" data-testid="button-admin-panel">
              <Link href="/admin">
                <Users className="mr-2 h-4 w-4" /> Admin Panel
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="kpi-total">{totalRecords}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records Added Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="kpi-today">{recordsToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common Cause</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold truncate" title={mostCommonCause} data-testid="kpi-cause">
              {mostCommonCause}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demographics</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold" data-testid="kpi-demographics">
              {maleCount} Male / {femaleCount} Female
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Trend (Past Year)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Deaths by Hospital Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {locationsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getLocationColor(entry.name)} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {locationsData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: getLocationColor(entry.name) }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Causes of Death</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={causesData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {causesData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={getCauseColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Cause of Death</TableHead>
                <TableHead>Hospital Location</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.slice(0, 5).map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    <Link href={`/records/${record.id}`} className="text-primary hover:underline">
                      {record.id}
                    </Link>
                  </TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.cause_of_death}</TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>{format(new Date(record.date_of_death), 'MMM dd, yyyy')}</TableCell>
                </TableRow>
              ))}
              {records.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
