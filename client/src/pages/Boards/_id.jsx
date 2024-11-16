// Boards Detail
import Container from "@mui/material/Container";
import AppBar from "@/components/AppBar/AppBar";
import BoardBar from "@/pages/Boards/BoardBar/BoardBar";
import BoardContent from "@/pages/Boards/BoardContent/BoardContent";
import { mockData } from "@/apis/mock-data";
import { useEffect, useState } from "react";
import { fetchBoardDetailsAPI } from "@/apis";
import { useParams } from "react-router-dom";

const Board = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // const { boardId } = useParams(); // Assumes your route is defined as "/board/:boardId"
    // console.log(boardId);
    const boardId = "67378930a70b592a92888876";
    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board);
    });
  }, []);

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
};

export default Board;
