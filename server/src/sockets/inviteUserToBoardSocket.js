// Param socket sẽ được lấy từ thư viện socket.io
export const inviteUserToBoardSocket = (socket) => {
  // Lắng nghe event mà client emit lên có tên là FE_USER_INVITED_TO_BOARD
  socket.on("FE_USER_INVITED_TO_BOARD", (invitation) => {
    // Cách làm nhanh và đơn giản nhất: emit ngược lại 1 sự kiện về cho mọi client khác (ngoại trừ chính thằng gửi req), rồi để phía FE check
    socket.broadcast.emit("BE_USER_INVITED_TO_BOARD", invitation);
  });
};
