import Board from "@/pages/Boards/_id";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth/Auth";
import AccountVerification from "@/pages/Auth/AccountVerification";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/user/userSlice";

/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của react-router-dom đề hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://reactrouter.com/en/main/components/outlet
 * Một bài hướng dẫn khá đầy đủ:
 * https://www.robinwieruch.de/react-router-private-routes/
 */

// Route allowed access after login
// Outlet show Child Route
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />;
  return <Outlet />;
};

function App() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Routes>
      {/* Routes chứa danh sách các route. */}
      {/* Route định nghĩa đường dẫn và component tương ứng. */}
      {/* React Router Dom */}
      <Route
        path='/'
        element={
          <Navigate to={"/boards/6738aa385aacfca400f0a002"} replace={true} />
        }
      />
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
