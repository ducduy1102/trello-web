// Boards Detail
import Container from "@mui/material/Container";
import AppBar from "@/components/AppBar/AppBar";
import BoardBar from "@/pages/Boards/BoardBar/BoardBar";
import BoardContent from "@/pages/Boards/BoardContent/BoardContent";
import { mockData } from "@/apis/mock-data";
import { useEffect, useState } from "react";
import {
  createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetailsAPI,
} from "@/apis";
import { useParams } from "react-router-dom";

const Board = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // const { boardId } = useParams(); // Assumes your route is defined as "/board/:boardId"
    // console.log(boardId);
    const boardId = "6738aa385aacfca400f0a002";
    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board);
    });
  }, []);

  // Call api create new column và làm lại data state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    console.log("created column", createdColumn);
    // Cập nhật state board
  };

  // Call api create new card và làm lại data state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    console.log("created Card", createNewCard);
    // Cập nhật state board
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  );
};

export default Board;
