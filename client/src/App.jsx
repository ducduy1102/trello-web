import Board from "@/pages/Boards/_id";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";

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
      <Route path='/boards/:boardId' element={<Board />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
