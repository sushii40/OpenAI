import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Milk, TrendingUp, IndianRupee, Calendar, 
  Building2, MessageSquare, ArrowRight, Star 
} from 'lucide-react';
import { dairyCompanies } from '@/data/dairyCompanies';

// Mock data for demo
const mockStats = {
  todayCollection: 45.5,
  monthlyCollection: 1250,
  avgFat: 4.2,
  totalEarnings: 52500,
  pendingPayment: 12800,
};

const recentCollections = [
  { date: '2026-01-10', shift: 'Morning', quantity: 22.5, fat: 4.3, amount: 1125 },
  { date: '2026-01-10', shift: 'Evening', quantity: 23.0, fat: 4.1, amount: 1104 },
  { date: '2026-01-09', shift: 'Morning', quantity: 21.8, fat: 4.2, amount: 1090 },
  { date: '2026-01-09', shift: 'Evening', quantity: 24.2, fat: 4.4, amount: 1234 },
];

export default function Dashboard() {
  const { farmer } = useAuth();
  const selectedDairy = dairyCompanies.find(d => d.id === farmer?.selectedDairy);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              नमस्ते, {farmer?.name}! 🙏
            </h1>
            <p className="text-muted-foreground">
              Welcome to your dairy dashboard • Farmer ID: {farmer?.id}
            </p>
          </div>
          
          <Link to="/chatbot">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask AI Assistant
            </Button>
          </Link>
        </div>

        {/* Dairy Selection Alert */}
        {!selectedDairy && (
          <Card className="border-accent bg-accent/10">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-accent" />
                <div>
                  <p className="font-medium text-foreground">Select Your Dairy Company</p>
                  <p className="text-sm text-muted-foreground">
                    Choose where you want to supply your milk
                  </p>
                </div>
              </div>
              <Link to="/dairies">
                <Button variant="outline" className="gap-2">
                  Browse Companies
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Collection
              </CardTitle>
              <Milk className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.todayCollection}L</div>
              <p className="text-xs text-muted-foreground">Morning + Evening</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.monthlyCollection}L</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Fat Content
              </CardTitle>
              <Star className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.avgFat}%</div>
              <p className="text-xs text-muted-foreground">Quality grade: A</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{mockStats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ₹{mockStats.pendingPayment.toLocaleString()} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Collections */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Collections
              </CardTitle>
              <CardDescription>Your last few milk submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCollections.map((collection, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        collection.shift === 'Morning' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {collection.shift === 'Morning' ? '🌅' : '🌙'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{collection.date}</p>
                        <p className="text-xs text-muted-foreground">{collection.shift} shift</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{collection.quantity}L</p>
                      <p className="text-xs text-muted-foreground">Fat: {collection.fat}%</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{collection.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/history" className="block mt-4">
                <Button variant="outline" className="w-full gap-2">
                  View Full History
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Selected Dairy Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Your Dairy
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDairy ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {selectedDairy.logo}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedDairy.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Payment: {selectedDairy.paymentCycle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Cow Milk</p>
                      <p className="font-bold">₹{selectedDairy.pricePerLiter.cow}/L</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-muted-foreground">Buffalo Milk</p>
                      <p className="font-bold">₹{selectedDairy.pricePerLiter.buffalo}/L</p>
                    </div>
                  </div>

                  <Link to="/dairies">
                    <Button variant="outline" size="sm" className="w-full">
                      Change Dairy
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-4">No dairy selected yet</p>
                  <Link to="/dairies">
                    <Button size="sm">Select Dairy</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Link to="/chatbot">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">AI Assistant</p>
                <p className="text-xs text-muted-foreground">Get market insights</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/market">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <TrendingUp className="h-8 w-8 text-accent mb-2" />
                <p className="font-medium">Market Data</p>
                <p className="text-xs text-muted-foreground">State-wise demand</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/dairies">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Dairy Companies</p>
                <p className="text-xs text-muted-foreground">Compare prices</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/history">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Calendar className="h-8 w-8 text-accent mb-2" />
                <p className="font-medium">Supply History</p>
                <p className="text-xs text-muted-foreground">Track collections</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
