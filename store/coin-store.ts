import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CoinPackage } from '@/types';

interface CoinState {
  coins: number;
  addCoins: (amount: number) => void;
  useCoins: (amount: number) => boolean;
}

export const useCoinStore = create<CoinState>()(
  persist(
    (set, get) => ({
      coins: 0,
      addCoins: (amount) => set((state) => ({ 
        coins: state.coins + amount 
      })),
      useCoins: (amount) => {
        const currentCoins = get().coins;
        if (currentCoins >= amount) {
          set({ coins: currentCoins - amount });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'ghibli-coins-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const coinPackages: CoinPackage[] = [
  {
    id: 'coins_10',
    coins: 10,
    price: '$0.99',
    priceAmount: 0.99
  },
  {
    id: 'coins_50',
    coins: 50,
    price: '$2.99',
    priceAmount: 2.99
  },
  {
    id: 'coins_100',
    coins: 100,
    price: '$4.99',
    priceAmount: 4.99
  }
];