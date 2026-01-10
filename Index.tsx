import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Milk, TrendingUp, Building2, MessageSquare, ArrowRight, Users, MapPin, IndianRupee } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Milk className="h-4 w-4" />
              किसान दूध पोर्टल
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Smart Dairy Portal for{' '}
              <span className="text-primary">Indian Farmers</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track milk supply, compare dairy companies, discover state-wise demand, 
              and get AI-powered market insights - all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/register">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Register as Farmer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Login to Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">Get instant answers about milk prices, demand & market trends</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Market Insights</h3>
                <p className="text-sm text-muted-foreground">State-wise consumption data & demand forecasts</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Dairy Companies</h3>
                <p className="text-sm text-muted-foreground">Compare Amul, Mother Dairy & more with live pricing</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Supply Tracking</h3>
                <p className="text-sm text-muted-foreground">Track daily collections, payments & fat content</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">8+</p>
              <p className="text-muted-foreground">Major Dairy Companies</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">30+</p>
              <p className="text-muted-foreground">States Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">24/7</p>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>🥛 Dairy Farmer Portal - Empowering Indian Farmers</p>
        </div>
      </footer>
    </div>
  );
}
