import Board from "@/pages/Boards/_id";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth/Auth";

function App() {
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
      {/* Board Details */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      {/* 404 Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
