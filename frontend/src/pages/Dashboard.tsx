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
  const { records } = useRecords();
  const { user } = useAuth();

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

  const COLORS = ['#e41e10', '#f32905', '#ea1a0f', '#ff6b6b', '#ff8787'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
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
            <CardTitle>Deaths by Location</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
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
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
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
                <TableHead>Location</TableHead>
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
