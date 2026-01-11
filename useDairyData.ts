import { useState, useEffect } from 'react';
import { StateConsumption, DairyProduct } from '@/types/dairy';

interface DairyDataset {
  stateConsumption: StateConsumption[];
  dairyProducts: DairyProduct[];
  demandForecast: { year: number; production: number }[];
  isLoading: boolean;
  error: string | null;
}

export function useDairyData(): DairyDataset {
  const [data, setData] = useState<DairyDataset>({
    stateConsumption: [],
    dairyProducts: [],
    demandForecast: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load state consumption data
        const consumptionRes = await fetch('/data/state_milk_consumption_ranking.csv');
        const consumptionText = await consumptionRes.text();
        const consumptionLines = consumptionText.trim().split('\n');
        const stateConsumption: StateConsumption[] = consumptionLines.slice(1).map(line => {
          const [state, year, production, rank] = line.split(',');
          return {
            state: state.trim(),
            year: year.trim(),
            production: parseFloat(production) || 0,
            rank: parseInt(rank) || 0,
          };
        });

        // Load demand forecast
        const forecastRes = await fetch('/data/national_milk_demand_forecast.csv');
        const forecastText = await forecastRes.text();
        const forecastLines = forecastText.trim().split('\n');
        const demandForecast = forecastLines.slice(1).map(line => {
          const [year, production] = line.split(',');
          return {
            year: parseInt(year),
            production: parseFloat(production) || 0,
          };
        });

        // Load dairy products (sample - first 100 rows for performance)
        const productsRes = await fetch('/data/dairy_dataset.csv');
        const productsText = await productsRes.text();
        const productsLines = productsText.trim().split('\n').slice(0, 101);
        const headers = productsLines[0].split(',');
        
        const dairyProducts: DairyProduct[] = productsLines.slice(1).map(line => {
          const values = line.split(',');
          return {
            location: values[0],
            productName: values[6],
            brand: values[7],
            quantity: parseFloat(values[8]) || 0,
            pricePerUnit: parseFloat(values[9]) || 0,
            totalValue: parseFloat(values[10]) || 0,
            customerLocation: values[17],
            salesChannel: values[18],
          };
        });

        setData({
          stateConsumption,
          dairyProducts,
          demandForecast,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load dairy data',
        }));
      }
    };

    loadData();
  }, []);

  return data;
}

// Helper functions for chatbot responses
export function getTopConsumingStates(data: StateConsumption[], limit = 5): StateConsumption[] {
  return [...data]
    .filter(s => s.state !== 'All India')
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);
}

export function getStateProduction(data: StateConsumption[], stateName: string): StateConsumption | undefined {
  return data.find(s => s.state.toLowerCase().includes(stateName.toLowerCase()));
}

export function getBrandPrices(data: DairyProduct[]): Map<string, { avgPrice: number; count: number }> {
  const brandMap = new Map<string, { total: number; count: number }>();
  
  data.forEach(product => {
    const existing = brandMap.get(product.brand) || { total: 0, count: 0 };
    brandMap.set(product.brand, {
      total: existing.total + product.pricePerUnit,
      count: existing.count + 1,
    });
  });

  const result = new Map<string, { avgPrice: number; count: number }>();
  brandMap.forEach((value, key) => {
    result.set(key, {
      avgPrice: Math.round(value.total / value.count * 100) / 100,
      count: value.count,
    });
  });

  return result;
}

export function getStateDemand(data: DairyProduct[]): Map<string, number> {
  const stateMap = new Map<string, number>();
  
  data.forEach(product => {
    const existing = stateMap.get(product.customerLocation) || 0;
    stateMap.set(product.customerLocation, existing + product.quantity);
  });

  return stateMap;
}
