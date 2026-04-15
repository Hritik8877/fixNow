import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';

export const fetchServices = createAsyncThunk('services/fetch', async (params = {}) => {
  const { data } = await api.get('/services', { params });
  return data;
});

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    allServices: [],
    filteredServices: [],
    filters: { category: '', search: '', minPrice: 0, maxPrice: 10000, minRating: 0 },
    sortBy: 'popular',
    loading: false,
    fetched: false,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      servicesSlice.caseReducers.applyFilters(state);
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      servicesSlice.caseReducers.applyFilters(state);
    },
    resetFilters: (state) => {
      state.filters = { category: '', search: '', minPrice: 0, maxPrice: 10000, minRating: 0 };
      state.sortBy = 'popular';
      state.filteredServices = [...state.allServices];
    },
    applyFilters: (state) => {
      let result = [...state.allServices];
      const { category, search, minPrice, maxPrice, minRating } = state.filters;
      if (category) result = result.filter(s => s.category === category);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }
      if (minPrice > 0) result = result.filter(s => s.price >= minPrice);
      if (maxPrice < 10000) result = result.filter(s => s.price <= maxPrice);
      if (minRating > 0) result = result.filter(s => s.rating >= minRating);

      switch (state.sortBy) {
        case 'price-low': result.sort((a, b) => a.price - b.price); break;
        case 'price-high': result.sort((a, b) => b.price - a.price); break;
        case 'rating': result.sort((a, b) => b.rating - a.rating); break;
        case 'reviews': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
        default: result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)); break;
      }
      state.filteredServices = result;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchServices.pending, (state) => { state.loading = true; });
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      state.loading = false;
      state.allServices = action.payload;
      state.fetched = true;
      servicesSlice.caseReducers.applyFilters(state);
    });
    builder.addCase(fetchServices.rejected, (state) => { state.loading = false; });
  },
});

export const { setFilter, setSortBy, resetFilters } = servicesSlice.actions;
export default servicesSlice.reducer;
