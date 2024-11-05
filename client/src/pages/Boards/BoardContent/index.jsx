import Box from "@mui/material/Box";
import React from "react";

const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "56px";

const BoardContent = () => {
  return (
    <Box
      sx={{
        // backgroundColor: "primary.main",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        width: "100%",
        height: (theme) => theme.trello.boardContentHeight,
        display: "flex",
      }}
    >
      {/* Box column */}
      <Box
        sx={{
          width: "300px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
          ml: 2,
          borderRadius: "6px",
        }}
      >
        <Box
          sx={{
            height: COLUMN_HEADER_HEIGHT,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Header
        </Box>

        <Box sx={{ height: "auto" }}>List Card</Box>

        <Box sx={{ height: COLUMN_FOOTER_HEIGHT }}>Footer</Box>
      </Box>
    </Box>
  );
};

export default BoardContent;
