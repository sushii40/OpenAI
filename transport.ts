export interface TransportMilestone {
  id: string;
  status: 'completed' | 'current' | 'upcoming';
  title: string;
  location: string;
  timestamp: Date | null;
  description: string;
  icon: 'pickup' | 'transit' | 'checkpoint' | 'quality' | 'delivered';
}

export interface Shipment {
  id: string;
  farmerId: string;
  dairyId: string;
  dairyName: string;
  quantity: number;
  cattleType: 'cow' | 'buffalo';
  pickupDate: Date;
  expectedDelivery: Date;
  actualDelivery: Date | null;
  status: 'scheduled' | 'picked_up' | 'in_transit' | 'at_checkpoint' | 'quality_check' | 'delivered' | 'delayed';
  currentLocation: string;
  milestones: TransportMilestone[];
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  temperature: number; // in Celsius
  distance: {
    total: number;
    covered: number;
  };
}

export interface TrackingUpdate {
  shipmentId: string;
  timestamp: Date;
  location: string;
  status: string;
  temperature: number;
  notes?: string;
}
