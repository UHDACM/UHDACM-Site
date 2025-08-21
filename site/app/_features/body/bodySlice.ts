import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialState = {
  overflowY: 'auto' | 'hidden' | 'scroll';
}

const initialState: initialState = {
  overflowY: "auto",
};

const bodySlice = createSlice({
  name: "body",
  initialState: initialState,
  reducers: {
    setOverflowY: (state, action: PayloadAction<initialState["overflowY"]>) => {
      state.overflowY = action.payload;
    },
  },
});

export const { setOverflowY } = bodySlice.actions;
export default bodySlice.reducer;
