import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';

const saved = localStorage.getItem('FixNow_user');
const parsedUser = saved ? JSON.parse(saved) : null;

export const loginUser = createAsyncThunk('auth/login', async ({ email, password, role }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password, role });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Login failed');
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', formData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Signup failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Failed to fetch profile');
  }
});

export const updateProfileApi = createAsyncThunk('auth/updateProfile', async (updates, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', updates);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Failed to update profile');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: parsedUser,
    isAuthenticated: !!parsedUser,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('FixNow_user');
      api.post('/auth/logout').catch(() => {});
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('FixNow_user', JSON.stringify(action.payload));
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Signup
    builder.addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('FixNow_user', JSON.stringify(action.payload));
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Fetch profile
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      const token = state.user?.token;
      state.user = { ...action.payload, token };
      localStorage.setItem('FixNow_user', JSON.stringify(state.user));
    });
    // Update profile
    builder.addCase(updateProfileApi.fulfilled, (state, action) => {
      const token = state.user?.token;
      state.user = { ...action.payload, token };
      localStorage.setItem('FixNow_user', JSON.stringify(state.user));
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
