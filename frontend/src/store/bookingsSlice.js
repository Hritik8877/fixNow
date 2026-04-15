import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api.js';

export const fetchBookings = createAsyncThunk('bookings/fetch', async () => {
  const { data } = await api.get('/bookings');
  return data;
});

export const createBooking = createAsyncThunk('bookings/create', async (bookingData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/bookings', bookingData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Failed to create booking');
  }
});

export const updateBookingStatusApi = createAsyncThunk('bookings/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/bookings/${id}/status`, { status });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Failed to update status');
  }
});

export const submitReviewApi = createAsyncThunk('bookings/submitReview', async ({ serviceId, bookingId, rating, comment }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/reviews', { serviceId, bookingId, rating, comment });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Failed to submit review');
  }
});

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    loading: false,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBookings.pending, (state) => { state.loading = true; });
    builder.addCase(fetchBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
      state.fetched = true;
    });
    builder.addCase(fetchBookings.rejected, (state) => { state.loading = false; });
    builder.addCase(createBooking.fulfilled, (state, action) => {
      state.bookings.unshift(action.payload);
    });
    builder.addCase(updateBookingStatusApi.fulfilled, (state, action) => {
      const idx = state.bookings.findIndex(b => b._id === action.payload._id);
      if (idx >= 0) state.bookings[idx] = action.payload;
    });
    builder.addCase(submitReviewApi.fulfilled, (state, action) => {
      if (action.payload.booking) {
        const idx = state.bookings.findIndex(b => b._id === action.payload.booking._id);
        if (idx >= 0) state.bookings[idx] = action.payload.booking;
      }
    });
  },
});

export default bookingsSlice.reducer;
