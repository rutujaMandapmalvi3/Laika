// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  userId: string | null;
  email: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  userRole: null,
  userId: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ userId: string; email: string; role: UserRole }>) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.userRole = action.payload.role;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.email = null;
      state.userRole = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
