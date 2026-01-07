// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: string | null;
  needsProfileSetup: boolean;
  userProfile: any | null;
  roleProfile: any | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  role: null,
  needsProfileSetup: false,
  userProfile: null,
  roleProfile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.role = action.payload.role || null;
      state.needsProfileSetup = action.payload.needsProfileSetup || false;
      state.userProfile = action.payload.userProfile || null;
      state.roleProfile = action.payload.roleProfile || null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.email = null;
      state.role = null;
      state.needsProfileSetup = false;
      state.userProfile = null;
      state.roleProfile = null;
    },
    updateProfile: (state, action: PayloadAction<any>) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
