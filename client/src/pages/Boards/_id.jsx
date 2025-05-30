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
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "@/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import PageLoadingSpinner from "@/components/Loading/PageLoadingPinner";
import ActiveCard from "@/components/Modal/ActiveCard/ActiveCard";
import { selectCurrentActiveCard } from "@/redux/activeCard/activeCardSlice";

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const activeCard = useSelector(selectCurrentActiveCard);
  const { boardId } = useParams();

  useEffect(() => {
    // Call API
    dispatch(fetchBoardDetailsAPI(boardId));
  }, [dispatch, boardId]);

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
    return <PageLoadingSpinner caption={"Loading board..."} />;
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      {/* Modal Active Card, check đóng/mở dựa theo điều kiện có tồn tại data activeCard lưu trong Redux hay không thì mới render. Mỗi thời điểm chỉ tồn tại một cái Modal Card dang Active */}
      {activeCard && <ActiveCard />}

      {/* Các thành phần còn lại của Board */}
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
