import Box from "@mui/material/Box";
import React from "react";
import ModeSelect from "@/components/ModeSelect";

const AppBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        width: "100%",
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: "flex",
        alignItems: "center",
      }}
    >
      <ModeSelect />
    </Box>
  );
};

export default AppBar;
