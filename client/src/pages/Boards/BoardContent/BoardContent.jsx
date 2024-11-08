import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ListColumn from "./ListColumns/ListColumn";
import { mapOrder } from "@/utils/sorts";
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { cloneDeep } from "lodash";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

const BoardContent = ({ board }) => {
  // Change position in columnOrderIds of mock-data => sort columns
  const [orderedColumns, setOrderedColumns] = useState([]);
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // });

  //  Ưu tiên sử dụng kết hợp 2 loại sensor là mouse + touch để có trải nghiệm trên mobile/tablet tốt nhất
  // Require the mouse to move by 10 pixels before activating events
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards.map((card) => card._id)?.includes(cardId)
    );
  };

  const handleDragStart = (e) => {
    // console.log("handleDragStart", e);
    setActiveDragItemId(e?.active?.id);
    setActiveDragItemType(
      e?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(e?.active?.data?.current);
  };

  // Trigger trong qtr kéo (drag) 1 phẩn tử
  const handleDragOver = (e) => {
    // console.log("Hành động kéo thả card");
    // ko làm gì thêm nếu như đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    // console.log("handerOver", e);
    const { active, over } = e;
    if (!active || !over) return;

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;

    // Xử lý khi kéo card sang column khác
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        // Tìm vị trí của overCard trong column đích (nơi mà activeCard sắp đc thả)
        const overCardIndex = overColumn?.cards.findIndex(
          (card) => card._id === overCardId
        );
        console.log("overCardIndex", overCardIndex);

        // Tính toán cho cardIndex mới (lấy từ thư viện)
        let newCardIndex;
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.cards?.length + 1;

        console.log(newCardIndex);
        console.log(isBelowOverItem);
        console.log(modifier);

        // clone mảng ordredColumnsState cũ ra 1 cái mới để xử lý data rồi mới return => cập nhật lại ordredColumnsState mới
        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activeColumn._id
        );
        const nextOverColumn = nextColumns.find(
          (column) => column._id === overColumn._id
        );

        // column cũ
        if (nextActiveColumn) {
          // Xóa card ở vị trí column active (tức là vị trí card dg lấy ra để bỏ sang column khác)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );

          // Cập nhật lại mảng cardOrderIds cho data
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id
          );
        }

        // column mới
        if (nextOverColumn) {
          // Check card dg kéo có tổn tại ở overColumn ko => nếu có => xóa
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );

          // Thêm card đg kéo vào vị trí ở column mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          );

          // Cập nhật lại mảng cardOrderIds cho data
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          );
        }

        return nextColumns;
      });
    }
  };

  const handleDragEnd = (e) => {
    // console.log("handleDragEnd",e);
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log("Hành động kéo thả card");
      return;
    }

    const { active, over } = e;

    // Case null
    if (!active || !over) return;

    if (active.id !== over.id) {
      // Get old position active
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);

      // Dùng arrayMove để sx lại mảng column
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // console.log(oldIndex, newIndex, dndOrderedColumns);

      // Xử lý gọi APIs
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
      // console.log("dndOrderedColumns", dndOrderedColumns);
      // console.log("dndOrderedColumnsIds", dndOrderedColumnsIds);
      setOrderedColumns(dndOrderedColumns);

      return dndOrderedColumns;
    }
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: 0.5,
        },
      },
    }),
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
        <ListColumn columns={orderedColumns} />
      </Box>
    </DndContext>
  );
};

export default BoardContent;
