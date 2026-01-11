import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { generateMockShipments } from '@/data/mockShipments';
import { ShipmentCard } from '@/components/tracking/ShipmentCard';
import { ShipmentDetailSheet } from '@/components/tracking/ShipmentDetailSheet';
import { Shipment } from '@/types/transport';
import { 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  MapPin,
  Thermometer
} from 'lucide-react';

export default function Transport() {
  const { farmer } = useAuth();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const shipments = useMemo(() => 
    generateMockShipments(farmer?.id || 'demo'), 
    [farmer?.id]
  );

  const stats = useMemo(() => ({
    total: shipments.length,
    inTransit: shipments.filter(s => ['in_transit', 'picked_up', 'at_checkpoint', 'quality_check'].includes(s.status)).length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    scheduled: shipments.filter(s => s.status === 'scheduled').length,
    delayed: shipments.filter(s => s.status === 'delayed').length,
  }), [shipments]);

  const handleTrack = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setSheetOpen(true);
  };

  const activeShipments = shipments.filter(s => 
    ['in_transit', 'picked_up', 'at_checkpoint', 'quality_check'].includes(s.status)
  );
  const completedShipments = shipments.filter(s => 
    ['delivered', 'delayed'].includes(s.status)
  );
  const upcomingShipments = shipments.filter(s => s.status === 'scheduled');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Transport Tracking
            </h1>
            <p className="text-muted-foreground">
              Track your milk shipments in real-time • दूध परिवहन ट्रैकिंग
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Shipments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inTransit}</p>
                  <p className="text-xs text-muted-foreground">In Transit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.scheduled}</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.delayed}</p>
                  <p className="text-xs text-muted-foreground">Delayed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Tracking Info Banner */}
        {activeShipments.length > 0 && (
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600">Live Tracking Active</p>
                    <p className="text-sm text-muted-foreground">
                      {activeShipments.length} shipment{activeShipments.length > 1 ? 's' : ''} currently being tracked
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-primary" />
                    <span>Cold Chain Monitored</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>GPS Tracking</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shipments Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="gap-2">
              <Truck className="h-4 w-4" />
              Active ({activeShipments.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-2">
              <Clock className="h-4 w-4" />
              Upcoming ({upcomingShipments.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({completedShipments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeShipments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {activeShipments.map(shipment => (
                  <ShipmentCard 
                    key={shipment.id} 
                    shipment={shipment} 
                    onTrack={handleTrack}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-lg font-medium">No Active Shipments</p>
                  <p className="text-muted-foreground">Your milk shipments in transit will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingShipments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingShipments.map(shipment => (
                  <ShipmentCard 
                    key={shipment.id} 
                    shipment={shipment} 
                    onTrack={handleTrack}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-lg font-medium">No Upcoming Shipments</p>
                  <p className="text-muted-foreground">Scheduled pickups will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedShipments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {completedShipments.map(shipment => (
                  <ShipmentCard 
                    key={shipment.id} 
                    shipment={shipment} 
                    onTrack={handleTrack}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-lg font-medium">No Completed Shipments</p>
                  <p className="text-muted-foreground">Delivered shipments will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Sheet */}
      <ShipmentDetailSheet 
        shipment={selectedShipment}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
