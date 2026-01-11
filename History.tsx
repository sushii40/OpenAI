import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { dairyCompanies } from '@/data/dairyCompanies';
import { Calendar, Download, Filter, CheckCircle2, Clock, AlertCircle, TrendingUp, Milk } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Generate mock history data
const generateMockHistory = () => {
  const history = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Morning shift
    history.push({
      id: `${dateStr}-morning`,
      date: dateStr,
      shift: 'Morning',
      quantity: 20 + Math.random() * 10,
      fatContent: 3.8 + Math.random() * 0.8,
      snfContent: 8.0 + Math.random() * 0.5,
      ratePerLiter: 48,
      status: i > 3 ? 'paid' : i > 1 ? 'verified' : 'pending',
    });
    
    // Evening shift
    history.push({
      id: `${dateStr}-evening`,
      date: dateStr,
      shift: 'Evening',
      quantity: 18 + Math.random() * 12,
      fatContent: 3.9 + Math.random() * 0.7,
      snfContent: 8.1 + Math.random() * 0.4,
      ratePerLiter: 48,
      status: i > 3 ? 'paid' : i > 1 ? 'verified' : 'pending',
    });
  }
  
  return history;
};

const mockHistory = generateMockHistory();

// Aggregate for chart
const dailyTotals = mockHistory.reduce((acc, item) => {
  const existing = acc.find(x => x.date === item.date);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    acc.push({ date: item.date, quantity: item.quantity });
  }
  return acc;
}, [] as { date: string; quantity: number }[])
.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
.slice(-14);

export default function History() {
  const { farmer } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'paid'>('all');
  
  const selectedDairy = dairyCompanies.find(d => d.id === farmer?.selectedDairy);
  
  const filteredHistory = filter === 'all' 
    ? mockHistory 
    : mockHistory.filter(h => h.status === filter);

  const stats = {
    totalQuantity: mockHistory.reduce((sum, h) => sum + h.quantity, 0),
    totalEarnings: mockHistory.filter(h => h.status === 'paid').reduce((sum, h) => sum + h.quantity * h.ratePerLiter, 0),
    pendingPayment: mockHistory.filter(h => h.status !== 'paid').reduce((sum, h) => sum + h.quantity * h.ratePerLiter, 0),
    avgFat: mockHistory.reduce((sum, h) => sum + h.fatContent, 0) / mockHistory.length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-primary/20 text-primary"><CheckCircle2 className="h-3 w-3 mr-1" />Paid</Badge>;
      case 'verified':
        return <Badge className="bg-accent/20 text-accent-foreground"><Clock className="h-3 w-3 mr-1" />Verified</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Supply History
            </h1>
            <p className="text-muted-foreground">
              Track your daily milk collections and payments
            </p>
          </div>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Milk className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalQuantity.toFixed(0)}L</p>
                  <p className="text-xs text-muted-foreground">Total This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Paid Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">₹{stats.pendingPayment.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Pending Payment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.avgFat.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Avg Fat Content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Collection Trend</CardTitle>
            <CardDescription>Last 14 days of milk collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTotals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)} L`, 'Quantity']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="quantity" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Collection Records */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Collection Records</CardTitle>
                <CardDescription>
                  {selectedDairy ? `Supplying to ${selectedDairy.name}` : 'Select a dairy to start tracking'}
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'pending' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === 'verified' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('verified')}
                >
                  Verified
                </Button>
                <Button
                  variant={filter === 'paid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('paid')}
                >
                  Paid
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredHistory.slice(0, 20).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      record.shift === 'Morning' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {record.shift === 'Morning' ? '🌅' : '🌙'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {new Date(record.date).toLocaleDateString('en-IN', { 
                          weekday: 'short', day: 'numeric', month: 'short' 
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">{record.shift} shift</p>
                    </div>
                  </div>
                  
                  <div className="text-center hidden sm:block">
                    <p className="font-medium">{record.quantity.toFixed(1)}L</p>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                  </div>
                  
                  <div className="text-center hidden md:block">
                    <p className="font-medium">{record.fatContent.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Fat</p>
                  </div>
                  
                  <div className="text-center hidden md:block">
                    <p className="font-medium">{record.snfContent.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">SNF</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ₹{(record.quantity * record.ratePerLiter).toFixed(0)}
                    </p>
                    {getStatusBadge(record.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
