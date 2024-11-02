import Box from "@mui/material/Box";
import React from "react";
import ModeSelect from "@/components/ModeSelect";
import AppsIcon from "@mui/icons-material/Apps";
// import trelloLogo from "@/assets/trello.svg";
import TrelloIcon from "@/assets/trello.svg?react";
// import { ReactComponent as TrelloIcon } from "@/assets/trello.svg";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import Workspaces from "./Menus/Workspaces";
import Recent from "./Menus/Recent";
import Started from "./Menus/Started";
import Templates from "./Menus/Templates";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Profiles from "./Menus/Profiles";

const AppBar = () => {
  return (
    <Box
      px={2}
      sx={{
        width: "100%",
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: (theme) => theme.trelloCustom.boardBarHeight,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <AppsIcon sx={{ color: "primary.main" }} />
        {/* <img src={trelloLogo} width={24} height={24} alt="Trello" /> */}
        <Box
          sx={{
            width: "100%",
            height: (theme) => theme.trelloCustom.boardBarHeight,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SvgIcon
            component={TrelloIcon}
            inheritViewBox
            sx={{ color: "primary.main" }}
          />
          <Typography
            variant="span"
            sx={{
              fontSize: "1.2rem",
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            Trello
          </Typography>
          <Workspaces />
          <Recent />
          <Started />
          <Templates />

          <Button variant="outlined">Create</Button>
        </Box>
      </Box>

      <Box
        px={2}
        sx={{
          width: "100%",
          height: (theme) => theme.trelloCustom.boardBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
        gap={3}
      >
        <TextField
          id="outlined-search"
          label="Search..."
          type="search"
          size="small"
        />
        <ModeSelect />

        <Tooltip title="Notifications">
          <Badge color="secondary" variant="dot" sx={{ cursor: "pointer" }}>
            <NotificationsNoneIcon />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: "pointer" }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
};

export default AppBar;
