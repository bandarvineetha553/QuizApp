import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from '../../utils/api';

export interface Category { id: string; name: string; }

interface CategoriesState {
  list: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoriesState = {
  list: [], status: 'idle', error: null
};

export const loadCategories = createAsyncThunk(
  'categories/load',
  async () => fetchCategories()
);

const slice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadCategories.pending, state => { state.status = 'loading'; })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list   = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error  = action.error.message || null;
      });
  },
});

export default slice.reducer;
