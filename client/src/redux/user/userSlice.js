import authorizedAxiosInstance from "@/utils/authorizeAxios";
import { API_ROOT } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Create value state of slice
const initialState = {
  currentUser: null,
};

// https://redux-toolkit.js.org/api/createAsyncThunk
export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    );
    return response.data;
  }
);

export const logoutUserAPI = createAsyncThunk(
  "user/logoutUserAPI",
  async (showSucessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`
    );
    if (showSucessMessage) {
      toast.success("Logged out successfully!");
    }
    return response.data;
  }
);

// Create slice on store
export const userSlice = createSlice({
  name: "user",
  initialState,

  // extraReducers: Nơi xử lý data bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });

    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null;
    });
  },
});

// Action creators are generated for each case reducer function
// Actions: nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để thông qua reducer (chạy đồng bộ)
// export const { } = userSlice.actions;

export const selectCurrentUser = (state) => {
  return state.user.currentUser;
};

export const userReducer = userSlice.reducer;
