import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import servicesReducer from './servicesSlice';
import bookingsReducer from './bookingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    bookings: bookingsReducer,
  },
});

export default store;