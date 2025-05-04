// Boards Detail
import Container from "@mui/material/Container";
import AppBar from "@/components/AppBar/AppBar";
import BoardBar from "@/pages/Boards/BoardBar/BoardBar";
import BoardContent from "@/pages/Boards/BoardContent/BoardContent";
import { useEffect } from "react";
import {
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
} from "@/apis";
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "@/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  // const [board, setBoard] = useState(null);

  useEffect(() => {
    // const { boardId } = useParams(); // Assumes your route is defined as "/board/:boardId"
    // console.log(boardId);
    const boardId = "6738aa385aacfca400f0a002";
    // Call API
    dispatch(fetchBoardDetailsAPI(boardId));

    // fetchBoardDetailsAPI(boardId).then((board) => {
    //   // Sắp xếp thứ tự column ở cha trước khi truyền xuống con
    //   board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");

    //   board.columns.forEach((column) => {
    //     // Xử lý kéo thả column rỗng khi f5
    //     if (isEmpty(column.cards)) {
    //       column.cards = [generatePlaceholderCard(column)];
    //       column.cardOrderIds = [generatePlaceholderCard(column)._id];
    //     } else {
    //       // Sắp xếp thứ tự cards ở cha trước khi truyền xuống con
    //       column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
    //     }
    //   });
    //   // console.log("board", board);
    //   setBoard(board);
    // });
  }, [dispatch]);

  // Call lại api sau khi kéo thả column => update mảng columnOrderIds của Board chứa nó
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    // Call api update Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  // Di chuyển card trong cùng 1 column
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // Cập nhật state board
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    dispatch(updateCurrentActiveBoard(newBoard));

    // Call API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
  };

  // Di chuyển card khác column
  /**
   * Flow
   * B1. Cập nhật mảng "cardOrderIds" của "column ban đầu" (tức là xóa _id của card vừa di chuyển sang column khác)
   * B2. Cập nhật mảng "cardOrderIds" của "column mới" (tức là thêm _id của card vừa di chuyển ở column mới)
   * B3. Cập nhật lại trường "columnId" của "card đã kéo"
   * => Viết 1 API làm việc này
   */
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    // Gọi API xử lý
    let prevCardOrderIds = dndOrderedColumns.find(
      (column) => column._id === prevColumnId
    )?.cardOrderIds;

    // Xử lý vấn đề khi kéo card cuối cùng ra khỏi column => column rỗng => có placeholder-card => remove trước khi gửi cho BE
    if (prevCardOrderIds[0].includes("placeholder-card") || []) {
      prevCardOrderIds = [];
    }
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(
        (column) => column._id === nextColumnId
      )?.cardOrderIds,
    });
  };

  if (!board) {
    return (
      <Box
        sx={{
          // position: "absolute",
          // top: "50%",
          // left: "50%",
          // transform: "translate(-50%, -50%)",
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading board...</Typography>
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
};

export default Board;
