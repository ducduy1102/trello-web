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
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const BoardContent = ({ board }) => {
  // Change position in columnOrderIds of mock-data => sort columns
  const [orderedColumns, setOrderedColumns] = useState([]);
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

  const handleDragEnd = (e) => {
    // console.log(e);
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
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumn columns={orderedColumns} />
      </Box>
    </DndContext>
  );
};

export default BoardContent;
