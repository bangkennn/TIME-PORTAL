import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
  page: number;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const initialFilters = {
  searchQuery: '',
  categoryFilter: 'all',
  statusFilter: 'all',
  page: 1,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialFilters,
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter, page: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set(initialFilters),
}));
