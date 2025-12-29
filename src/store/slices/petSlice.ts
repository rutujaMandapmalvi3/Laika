// src/store/slices/petSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pet } from '../../types';

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
}

const initialState: PetState = {
  pets: [],
  selectedPet: null,
};

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    setPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload;
    },
    setSelectedPet: (state, action: PayloadAction<Pet>) => {
      state.selectedPet = action.payload;
    },
  },
});

export const { setPets, setSelectedPet } = petSlice.actions;
export default petSlice.reducer;
