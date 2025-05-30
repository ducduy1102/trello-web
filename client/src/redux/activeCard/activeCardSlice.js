import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo giá trị của một Slice trong redux
const initialState = {
  currentActiveCard: null,
};

// Khởi tạo một slice trong kho lưu trữ redux store
export const activeCardSlice = createSlice({
  name: "activeCard",
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null;
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload;
      // Update lại dữ liệu currentActiveCard trong Redux
      state.currentActiveCard = fullCard;
    },
  },
  //   ExtraReducers: Xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {},
});

export const { clearCurrentActiveCard, updateCurrentActiveCard } =
  activeCardSlice.actions;

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard;
};

// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer;
