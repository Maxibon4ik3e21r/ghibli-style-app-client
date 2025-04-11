import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Photo } from '@/types';

interface PhotoState {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  deleteAllPhotos: () => void;
}

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set) => ({
      photos: [],
      addPhoto: (photo) => set((state) => ({ 
        photos: [photo, ...state.photos] 
      })),
      updatePhoto: (id, updates) => set((state) => ({
        photos: state.photos.map((photo) => 
          photo.id === id ? { ...photo, ...updates } : photo
        )
      })),
      deleteAllPhotos: () => set({ photos: [] }),
    }),
    {
      name: 'ghibli-photos-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);