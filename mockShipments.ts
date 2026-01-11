import { Shipment, TransportMilestone } from '@/types/transport';

const createMilestones = (status: Shipment['status'], pickupLocation: string, dairyName: string): TransportMilestone[] => {
  const now = new Date();
  const baseTime = new Date(now);
  baseTime.setHours(5, 30, 0, 0);

  const milestones: TransportMilestone[] = [
    {
      id: '1',
      status: 'completed',
      title: 'Pickup Scheduled',
      location: pickupLocation,
      timestamp: new Date(baseTime),
      description: 'Milk collection scheduled from farm',
      icon: 'pickup',
    },
    {
      id: '2',
      status: ['scheduled'].includes(status) ? 'upcoming' : 'completed',
      title: 'Collected from Farm',
      location: pickupLocation,
      timestamp: ['scheduled'].includes(status) ? null : new Date(baseTime.getTime() + 30 * 60000),
      description: 'Milk collected and loaded into refrigerated vehicle',
      icon: 'pickup',
    },
    {
      id: '3',
      status: ['scheduled', 'picked_up'].includes(status) ? 'upcoming' : 
              status === 'in_transit' ? 'current' : 'completed',
      title: 'In Transit',
      location: 'En route to collection center',
      timestamp: ['scheduled', 'picked_up'].includes(status) ? null : new Date(baseTime.getTime() + 60 * 60000),
      description: 'Vehicle on the way to nearest collection center',
      icon: 'transit',
    },
    {
      id: '4',
      status: ['scheduled', 'picked_up', 'in_transit'].includes(status) ? 'upcoming' : 
              status === 'at_checkpoint' ? 'current' : 'completed',
      title: 'Collection Center',
      location: 'Regional Collection Center',
      timestamp: ['scheduled', 'picked_up', 'in_transit'].includes(status) ? null : new Date(baseTime.getTime() + 120 * 60000),
      description: 'Arrived at collection center for consolidation',
      icon: 'checkpoint',
    },
    {
      id: '5',
      status: ['scheduled', 'picked_up', 'in_transit', 'at_checkpoint'].includes(status) ? 'upcoming' : 
              status === 'quality_check' ? 'current' : 'completed',
      title: 'Quality Check',
      location: dairyName,
      timestamp: ['scheduled', 'picked_up', 'in_transit', 'at_checkpoint'].includes(status) ? null : new Date(baseTime.getTime() + 180 * 60000),
      description: 'Fat content, SNF, and temperature verification',
      icon: 'quality',
    },
    {
      id: '6',
      status: status === 'delivered' ? 'completed' : 'upcoming',
      title: 'Delivered',
      location: dairyName,
      timestamp: status === 'delivered' ? new Date(baseTime.getTime() + 210 * 60000) : null,
      description: 'Successfully delivered and payment initiated',
      icon: 'delivered',
    },
  ];

  return milestones;
};

export const generateMockShipments = (farmerId: string): Shipment[] => {
  const today = new Date();
  
  const shipments: Shipment[] = [
    {
      id: 'SHP-001',
      farmerId,
      dairyId: 'amul',
      dairyName: 'Amul Dairy',
      quantity: 25.5,
      cattleType: 'buffalo',
      pickupDate: new Date(today.setHours(5, 30, 0, 0)),
      expectedDelivery: new Date(today.setHours(9, 30, 0, 0)),
      actualDelivery: null,
      status: 'in_transit',
      currentLocation: 'Near Mehsana Highway Toll',
      milestones: createMilestones('in_transit', 'Village Kheda, Gujarat', 'Amul Dairy, Anand'),
      vehicleNumber: 'GJ 18 AB 1234',
      driverName: 'Ramesh Patel',
      driverPhone: '+91 98765 43210',
      temperature: 4.2,
      distance: { total: 85, covered: 42 },
    },
    {
      id: 'SHP-002',
      farmerId,
      dairyId: 'mother-dairy',
      dairyName: 'Mother Dairy',
      quantity: 18.2,
      cattleType: 'cow',
      pickupDate: new Date(today.getTime() - 24 * 60 * 60 * 1000),
      expectedDelivery: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      actualDelivery: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 3.5 * 60 * 60 * 1000),
      status: 'delivered',
      currentLocation: 'Mother Dairy Plant, Delhi',
      milestones: createMilestones('delivered', 'Village Sonipat, Haryana', 'Mother Dairy, Delhi'),
      vehicleNumber: 'HR 26 CD 5678',
      driverName: 'Suresh Kumar',
      driverPhone: '+91 98765 12345',
      temperature: 4.0,
      distance: { total: 65, covered: 65 },
    },
    {
      id: 'SHP-003',
      farmerId,
      dairyId: 'amul',
      dairyName: 'Amul Dairy',
      quantity: 22.0,
      cattleType: 'buffalo',
      pickupDate: new Date(today.getTime() + 12 * 60 * 60 * 1000),
      expectedDelivery: new Date(today.getTime() + 16 * 60 * 60 * 1000),
      actualDelivery: null,
      status: 'scheduled',
      currentLocation: 'Pickup scheduled',
      milestones: createMilestones('scheduled', 'Village Kheda, Gujarat', 'Amul Dairy, Anand'),
      vehicleNumber: 'GJ 18 AB 4567',
      driverName: 'Mahesh Shah',
      driverPhone: '+91 98765 67890',
      temperature: 0,
      distance: { total: 85, covered: 0 },
    },
    {
      id: 'SHP-004',
      farmerId,
      dairyId: 'nandini',
      dairyName: 'Nandini Dairy (KMF)',
      quantity: 30.0,
      cattleType: 'cow',
      pickupDate: new Date(today.setHours(6, 0, 0, 0)),
      expectedDelivery: new Date(today.setHours(10, 0, 0, 0)),
      actualDelivery: null,
      status: 'quality_check',
      currentLocation: 'Nandini Quality Lab, Bangalore',
      milestones: createMilestones('quality_check', 'Village Mandya, Karnataka', 'Nandini Dairy, Bangalore'),
      vehicleNumber: 'KA 01 EF 9012',
      driverName: 'Venkatesh Gowda',
      driverPhone: '+91 98765 11111',
      temperature: 4.1,
      distance: { total: 120, covered: 115 },
    },
    {
      id: 'SHP-005',
      farmerId,
      dairyId: 'amul',
      dairyName: 'Amul Dairy',
      quantity: 20.5,
      cattleType: 'buffalo',
      pickupDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      expectedDelivery: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      actualDelivery: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
      status: 'delayed',
      currentLocation: 'Amul Dairy, Anand (Delayed)',
      milestones: createMilestones('delivered', 'Village Kheda, Gujarat', 'Amul Dairy, Anand'),
      vehicleNumber: 'GJ 18 AB 3456',
      driverName: 'Jigar Patel',
      driverPhone: '+91 98765 22222',
      temperature: 5.8,
      distance: { total: 85, covered: 85 },
    },
  ];

  return shipments;
};
