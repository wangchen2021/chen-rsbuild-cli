import { createSlice } from '@reduxjs/toolkit';

export interface TestState {
  count: number;
}

const initialState: TestState = {
  count: 0,
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
  },
});

export const { increment } = testSlice.actions;
export default testSlice.reducer;
