import { API_ROOT } from "@/utils/constants";
import { generatePlaceholderCard } from "@/utils/formatters";
import { mapOrder } from "@/utils/sorts";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { isEmpty } from "lodash";

// Create value state of slice
const initialState = {
  currentActiveBoard: null,
};

// Các hành động gọi APIs (bất đồng bộ) đã cập nhật data và Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
    return response.data;
  }
);

// Create slice on store
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  // reducers: Nơi xử lý data đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const board = action.payload;
      // Handle data
      //...

      // Update data
      state.currentActiveBoard = board;
    },
  },
  // extraReducers: Nơi xử lý data bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload chính là response.data trả về ở trên fetchBoardDetailsAPI()
      let board = action.payload;

      // Handle data
      board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

      board.columns.forEach((column) => {
        // Xử lý kéo thả column rỗng khi f5
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          // Sắp xếp thứ tự cards ở cha trước khi truyền xuống con
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
        }
      });

      // Update data
      state.currentActiveBoard = board;
    });
  },
});

// Action creators are generated for each case reducer function
// Actions: nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để thông qua reducer (chạy đồng bộ)
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;

// Selectors: nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy data từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard;
};

// File này tên activeBoardSlice nhưng sẽ export ra 1 thứ tên là Reducer
// export default activeBoardSlice.reducer;
export const activeBoardReducer = activeBoardSlice.reducer;
