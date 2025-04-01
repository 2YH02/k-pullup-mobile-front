import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchData {
  markerId?: number | null;
  address_name: string;
  place_name?: string;
  lat?: number;
  lng?: number;
}

interface SearchState {
  searches: SearchData[];
  addSearch: (data: SearchData) => void;
  removeItem: (address: string) => void;
  clearSearches: VoidFunction;
}

const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searches: [],
      addSearch: (data: SearchData) =>
        set((state) => {
          const item = state.searches.findIndex((search) => {
            return search.address_name === data.address_name;
          });

          if (state.searches.length >= 30) {
            const newSearch = [...state.searches];
            newSearch.pop();
            return { searches: [data, ...newSearch] };
          }

          if (item !== -1) {
            const newSearch = [...state.searches].filter((search) => {
              return search.address_name !== data.address_name;
            });
            return { searches: [data, ...newSearch] };
          }
          return { searches: [data, ...state.searches] };
        }),
      removeItem: (address: string) =>
        set((state) => {
          const newSearches = state.searches.filter((search) => {
            return search.address_name !== address;
          });

          if (newSearches) {
            return { searches: newSearches };
          }

          return { searches: state.searches };
        }),
      clearSearches: () => set({ searches: [] }),
    }),
    {
      name: "search-history",
    }
  )
);

export default useSearchStore;
