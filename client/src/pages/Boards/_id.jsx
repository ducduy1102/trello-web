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
import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "@/utils/formatters";

const Board = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // const { boardId } = useParams(); // Assumes your route is defined as "/board/:boardId"
    // console.log(boardId);
    const boardId = "6738aa385aacfca400f0a002";
    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Xử lý kéo thả column rỗng khi f5
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        }
      });
      console.log(board);
      setBoard(board);
    });
  }, []);

  // Call api create new column và làm lại data state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    // Xử lý kéo thả 1 column rỗng khi tạo mới column
    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];
    console.log("created column", createdColumn);

    // Cập nhật state board
    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };

  // Call api create new card và làm lại data state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    // console.log("created Card", createNewCard);

    // Cập nhật state board
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard);
      columnToUpdate.cardOrderIds.push(createdCard._id);
    }
    setBoard(newBoard);
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
