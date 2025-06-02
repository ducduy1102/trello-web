import authorizedAxiosInstance from "@/utils/authorizeAxios";
import { API_ROOT } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentNotifications: null,
};

export const fetchInvitationsAPI = createAsyncThunk(
  "notifications/fetchInvitationsAPI",
  async () => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/invitations`
    );
    return response.data;
  }
);

export const updateBoardInvitationAPI = createAsyncThunk(
  "notifications/updateBoardInvitationAPI",
  async ({ status, invitationId }) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/invitations/board/${invitationId}`,
      { status }
    );
    return response.data;
  }
);

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  // Xử lý dữ liệu đồng bộ
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null;
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload;
    },
    addNotification: (state, action) => {
      const incomingInvitation = action.payload;
      //  unshift: thêm phần tử vào đầu mảng
      state.currentNotifications.unshift(incomingInvitation);
    },
  },
  // Xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let incomingInvitations = action.payload;
      // Đảo ngược lại mảng invitations nhận được để hiển thị thông báo mới nhất lên đầu
      state.currentNotifications = Array.isArray(incomingInvitations)
        ? incomingInvitations.reverse()
        : [];
    });

    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload;

      // Cập nhật dữ liệu boardInvitation (bên trong sẽ có Status mới sau khi cập nhật)
      const getInvitation = state.currentNotifications.find(
        (i) => i._id === incomingInvitation._id
      );

      getInvitation.boardInvitation = incomingInvitation.boardInvitation;
    });
  },
});

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification,
} = notificationsSlice.actions;

export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications;
};

export const notificationsReducer = notificationsSlice.reducer;
