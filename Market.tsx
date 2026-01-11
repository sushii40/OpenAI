import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDairyData, getTopConsumingStates, getStateDemand } from '@/hooks/useDairyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, MapPin, Package, Loader2 } from 'lucide-react';

const COLORS = ['hsl(142, 50%, 35%)', 'hsl(38, 85%, 55%)', 'hsl(200, 70%, 50%)', 'hsl(30, 35%, 30%)', 'hsl(142, 40%, 60%)'];

export default function Market() {
  const { stateConsumption, dairyProducts, demandForecast, isLoading } = useDairyData();

  const topStates = getTopConsumingStates(stateConsumption, 10);
  const stateDemand = getStateDemand(dairyProducts);
  
  const demandData = Array.from(stateDemand.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([state, qty]) => ({ state, quantity: Math.round(qty) }));

  const productTypes = dairyProducts.reduce((acc, p) => {
    const existing = acc.find(x => x.name === p.productName);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: p.productName, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[])
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Loading market data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Market Insights
          </h1>
          <p className="text-muted-foreground">
            State-wise milk consumption, demand trends, and market analysis
          </p>
        </div>

        {/* Top Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* State Consumption Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Top Milk Consuming States
              </CardTitle>
              <CardDescription>Per capita consumption (grams/day)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topStates} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis 
                      dataKey="state" 
                      type="category" 
                      width={100} 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="production" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Demand by State */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                Demand by Customer State
              </CardTitle>
              <CardDescription>Based on recent sales data (liters)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demandData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="state" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="quantity" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution of dairy products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name }) => name}
                    >
                      {productTypes.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Forecast */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                National Milk Production Forecast
              </CardTitle>
              <CardDescription>Projected production in million tonnes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demandForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" tick={{ fill: 'hsl(var(--foreground))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)} MT`, 'Production']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="production" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Key Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 rounded-lg bg-primary/10">
                <p className="font-semibold text-primary">Punjab Leads</p>
                <p className="text-sm text-muted-foreground">Highest per capita milk consumption in India</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10">
                <p className="font-semibold text-accent-foreground">Metro Demand</p>
                <p className="text-sm text-muted-foreground">Delhi, Mumbai see consistent high demand</p>
              </div>
              <div className="p-4 rounded-lg bg-grass-light">
                <p className="font-semibold text-earth">Growth Trend</p>
                <p className="text-sm text-muted-foreground">4-5% annual increase in production</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="font-semibold text-secondary-foreground">Premium Products</p>
                <p className="text-sm text-muted-foreground">Ice cream & cheese command higher prices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
