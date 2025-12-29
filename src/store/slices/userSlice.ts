// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  profile: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    clearUserProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
