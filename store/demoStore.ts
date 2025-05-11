import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the store state type
interface DemoState {
  deviceId: string;
  requestCount: number;
  isLimitExceeded: boolean;
  isModalShown: boolean;
  
  // Actions
  incrementRequestCount: () => void;
  setDeviceId: (id: string) => void;
  showModal: () => void;
  hideModal: () => void;
  resetCount: () => void;
}

// Generate a simple device fingerprint based on available browser information
const generateDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const colorDepth = window.screen.colorDepth;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  
  // Create a string from the collected data and hash it
  const rawId = `${userAgent}-${screenWidth}x${screenHeight}-${colorDepth}-${timezone}-${language}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < rawId.length; i++) {
    const char = rawId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString(16);
};

// Create the store with persistence
export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      deviceId: '',
      requestCount: 0,
      isLimitExceeded: false,
      isModalShown: false,
      
      incrementRequestCount: () => {
        const currentCount = get().requestCount;
        const newCount = currentCount + 1;
        const isExceeded = newCount > 10;
        
        set({
          requestCount: newCount,
          isLimitExceeded: isExceeded,
          isModalShown: isExceeded && !get().isModalShown
        });
      },
      
      setDeviceId: (id: string) => set({ deviceId: id }),
      
      showModal: () => set({ isModalShown: true }),
      
      hideModal: () => set({ isModalShown: false }),
      
      resetCount: () => set({ requestCount: 0, isLimitExceeded: false, isModalShown: false })
    }),
    {
      name: 'demo-storage', // name of the item in the storage
      getStorage: () => localStorage, // use localStorage
      partialize: (state) => ({ 
        deviceId: state.deviceId, 
        requestCount: state.requestCount 
      }), // only persist these fields
    }
  )
);

// Hook to initialize device ID on client side
export const useInitializeDemoStore = () => {
  const { deviceId, setDeviceId } = useDemoStore();
  
  if (typeof window !== 'undefined' && !deviceId) {
    const id = generateDeviceId();
    setDeviceId(id);
  }
  
  return null;
};