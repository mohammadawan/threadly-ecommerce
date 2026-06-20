import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getMe, updateMe } from '../api/authApi';

const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUser(data);
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUser(data);
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await getMe();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await updateMe(data);
    const current = JSON.parse(localStorage.getItem('userInfo') || '{}');
    localStorage.setItem('userInfo', JSON.stringify({ ...current, ...res.data }));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { userInfo, loading: false, error: null },
  reducers: {
    logout(state) {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const fulfilled = (state, action) => { state.loading = false; state.userInfo = action.payload; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(login.pending, pending).addCase(login.fulfilled, fulfilled).addCase(login.rejected, rejected)
      .addCase(register.pending, pending).addCase(register.fulfilled, fulfilled).addCase(register.rejected, rejected)
      .addCase(fetchMe.fulfilled, (state, action) => { state.userInfo = { ...state.userInfo, ...action.payload }; })
      .addCase(updateProfile.pending, pending).addCase(updateProfile.fulfilled, fulfilled).addCase(updateProfile.rejected, rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
