export interface Photo {
    id: string;
    originalUrl: string;
    transformedUrl?: string;
    createdAt: number;
    status: 'processing' | 'completed' | 'failed';
  }
  
  export interface CoinPackage {
    id: string;
    coins: number;
    price: string;
    priceAmount: number;
  }