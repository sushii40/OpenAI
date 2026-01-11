import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { dairyCompanies } from '@/data/dairyCompanies';
import { Building2, MapPin, Star, Users, CheckCircle2, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dairies() {
  const { farmer, updateFarmer } = useAuth();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState(farmer?.selectedDairy || null);

  const handleSelect = (dairyId: string) => {
    setSelectedId(dairyId);
    updateFarmer({ selectedDairy: dairyId });
    
    const dairy = dairyCompanies.find(d => d.id === dairyId);
    toast({
      title: "Dairy Selected! ✅",
      description: `You've selected ${dairy?.name}. You can now track your milk supply with them.`,
    });
  };

  // Filter dairies that operate in farmer's state
  const availableDairies = farmer?.state 
    ? dairyCompanies.filter(d => d.states.includes(farmer.state))
    : dairyCompanies;

  const otherDairies = farmer?.state 
    ? dairyCompanies.filter(d => !d.states.includes(farmer.state))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Dairy Companies
          </h1>
          <p className="text-muted-foreground">
            Select a dairy company to supply your milk and start tracking
          </p>
        </div>

        {farmer?.state && availableDairies.length > 0 && (
          <div className="rounded-lg bg-primary/10 p-4 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <p className="text-sm">
              Showing dairies that operate in <strong>{farmer.state}</strong>
            </p>
          </div>
        )}

        {/* Available Dairies */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableDairies.map((dairy) => (
            <Card 
              key={dairy.id}
              className={`relative transition-all hover:shadow-md ${
                selectedId === dairy.id ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
            >
              {selectedId === dairy.id && (
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {dairy.logo}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{dairy.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {dairy.rating}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Cow Milk</p>
                    <p className="text-lg font-bold text-primary flex items-center justify-center">
                      <IndianRupee className="h-4 w-4" />
                      {dairy.pricePerLiter.cow}/L
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Buffalo Milk</p>
                    <p className="text-lg font-bold text-primary flex items-center justify-center">
                      <IndianRupee className="h-4 w-4" />
                      {dairy.pricePerLiter.buffalo}/L
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Cycle</span>
                    <Badge variant="secondary" className="capitalize">
                      {dairy.paymentCycle}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Farmers
                    </span>
                    <span className="font-medium">
                      {(dairy.totalFarmers / 1000).toFixed(0)}K+
                    </span>
                  </div>
                </div>

                {/* States */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Operating States:</p>
                  <div className="flex flex-wrap gap-1">
                    {dairy.states.slice(0, 3).map((state) => (
                      <Badge key={state} variant="outline" className="text-xs">
                        {state}
                      </Badge>
                    ))}
                    {dairy.states.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{dairy.states.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action */}
                <Button
                  className="w-full"
                  variant={selectedId === dairy.id ? 'secondary' : 'default'}
                  onClick={() => handleSelect(dairy.id)}
                >
                  {selectedId === dairy.id ? 'Currently Selected' : 'Select This Dairy'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Other Dairies */}
        {otherDairies.length > 0 && (
          <>
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                Other Dairy Companies (Not in {farmer?.state})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {otherDairies.map((dairy) => (
                  <Card key={dairy.id} className="opacity-60">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{dairy.logo}</span>
                        <div>
                          <p className="font-medium text-sm">{dairy.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ₹{dairy.pricePerLiter.cow}-{dairy.pricePerLiter.buffalo}/L
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Available in: {dairy.states.slice(0, 2).join(', ')}
                        {dairy.states.length > 2 && '...'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
