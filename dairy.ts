export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  cattleType: 'cow' | 'buffalo' | 'both';
  cattleCount: number;
  selectedDairy: string | null;
  registeredAt: Date;
}

export interface DairyCompany {
  id: string;
  name: string;
  logo: string;
  states: string[];
  pricePerLiter: {
    cow: number;
    buffalo: number;
  };
  rating: number;
  totalFarmers: number;
  paymentCycle: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

export interface MilkCollection {
  id: string;
  farmerId: string;
  dairyId: string;
  date: string;
  quantity: number;
  fatContent: number;
  snfContent: number;
  ratePerLiter: number;
  totalAmount: number;
  cattleType: 'cow' | 'buffalo';
  shift: 'morning' | 'evening';
  status: 'pending' | 'verified' | 'paid';
}

export interface StateConsumption {
  state: string;
  year: string;
  production: number;
  rank: number;
}

export interface DairyProduct {
  location: string;
  productName: string;
  brand: string;
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  customerLocation: string;
  salesChannel: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}
