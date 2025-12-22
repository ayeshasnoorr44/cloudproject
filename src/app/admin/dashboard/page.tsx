import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  Bar,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react";

export default function DashboardPage() {
  const engagementData = [
    { date: "Day 1", visits: 220 },
    { date: "Day 2", visits: 350 },
    { date: "Day 3", visits: 300 },
    { date: "Day 4", visits: 420 },
    { date: "Day 5", visits: 510 },
    { date: "Day 6", visits: 480 },
    { date: "Day 7", visits: 600 },
  ];

  const topProductsData = [
    { name: "Pillow Talk Lipstick", views: 4500 },
    { name: "Rouge Dior 999", views: 4200 },
    { name: "Lip Power Satin", views: 3800 },
    { name: "Addict Shine", views: 3500 },
    { name: "Luxury Palette", views: 3200 },
  ];
  
  const deviceData = [
    { name: 'Desktop', value: 55, fill: 'hsl(var(--chart-1))' },
    { name: 'Mobile', value: 35, fill: 'hsl(var(--chart-2))' },
    { name: 'Tablet', value: 10, fill: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales (Simulated)</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2.4%</div>
                    <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle className="font-headline">7-Day Engagement</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={engagementData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                }}
                            />
                            <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline">Top Products by Views</CardTitle>
                    <CardDescription>An overview of the most viewed products.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={topProductsData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={150} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <Tooltip
                                 contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                }}
                                cursor={{ fill: 'hsl(var(--secondary))' }}
                            />
                            <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline">Device Breakdown</CardTitle>
                <CardDescription>Visitor breakdown by device type.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                            {deviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}
