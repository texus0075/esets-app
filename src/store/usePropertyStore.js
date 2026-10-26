import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toggleSoldStatus, deleteProperty as firestoreDelete } from "../services/propertyService";

/**
 * REPO #4 / Ultra-Fast Zustand State Engine (pmndrs/zustand ⭐ 51k+)
 * 
 * Provides:
 * 1. 0ms Optimistic UI updates for 'Sold It' (zero perceived network lag)
 * 2. Automatic synchronization across React components without prop drilling
 * 3. Offline persistent storage synchronization
 */
export const usePropertyStore = create(
  persist(
    (set, get) => ({
      properties: [],
      savedPropertyIds: [],
      myPropertyIds: [],
      selectedDistrict: "All Districts",
      dealTypeFilter: "All",
      categoryFilter: "All",

      // Set whole list (called by live Firestore subscriber)
      setProperties: (props) => set({ properties: props || [] }),

      // Add single new property
      addPropertyOptimistic: (prop) => 
        set((state) => ({ properties: [prop, ...state.properties.filter(p => p.id !== prop.id)] })),

      // 0ms Optimistic 'Sold It' Toggle
      toggleSoldOptimistic: async (propertyId, currentStatus) => {
        const nextStatus = !currentStatus;
        
        // 1. Immediate in-memory state mutation (0ms)
        set((state) => ({
          properties: state.properties.map((p) => 
            p.id === propertyId ? { ...p, isSold: nextStatus, soldAt: nextStatus ? new Date().toISOString() : null } : p
          )
        }));

        // 2. Background cloud synchronization
        try {
          await toggleSoldStatus(propertyId, currentStatus);
        } catch (err) {
          console.error("Zustand optimistic sold sync failed, rolling back:", err);
          // Rollback on fatal failure
          set((state) => ({
            properties: state.properties.map((p) => 
              p.id === propertyId ? { ...p, isSold: currentStatus } : p
            )
          }));
        }
      },

      // Delete property
      deletePropertyOptimistic: async (propertyId) => {
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== propertyId),
          myPropertyIds: state.myPropertyIds.filter((id) => id !== propertyId)
        }));
        try {
          await firestoreDelete(propertyId);
        } catch (err) {
          console.error("Delete sync error:", err);
        }
      },

      // Bookmarks / Saved Properties Toggle
      toggleSavedProperty: (id) => 
        set((state) => ({
          savedPropertyIds: state.savedPropertyIds.includes(id)
            ? state.savedPropertyIds.filter((x) => x !== id)
            : [...state.savedPropertyIds, id]
        })),

      // Filter Setters
      setSelectedDistrict: (district) => set({ selectedDistrict: district }),
      setDealTypeFilter: (dealType) => set({ dealTypeFilter: dealType }),
      setCategoryFilter: (category) => set({ categoryFilter: category })
    }),
    {
      name: "esets_zustand_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedPropertyIds: state.savedPropertyIds,
        myPropertyIds: state.myPropertyIds,
        selectedDistrict: state.selectedDistrict
      })
    }
  )
);
