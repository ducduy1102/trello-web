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

  const handleDragEnd = (e) => {
    // console.log("handleDragEnd",e);
    const { active, over } = e;

    // Case null
    if (!over) return;

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
