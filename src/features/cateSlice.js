import { createSlice } from "@reduxjs/toolkit";

// app APi

const initialState = [];

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    updateCategory: (state, action) => {
      // console.log("action:",action.payload);
      return (state = action.payload);
    },
  },
});

export const { updateCategory } = categorySlice.actions;
export default categorySlice.reducer;
