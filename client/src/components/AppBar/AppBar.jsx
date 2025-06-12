import Box from "@mui/material/Box";
import ModeSelect from "@/components/ModeSelect/ModeSelect";
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
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Profiles from "./Menus/Profiles";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { useState } from "react";
import { Link } from "react-router-dom";
import Notifications from "./Notifications/Notifications";
import AutoCompleteSearchBoard from "./SearchBoards/AutoCompleteSearchBoard";

const AppBar = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
        "&::-webkit-scrollbar-track": {
          m: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Link to='/boards'>
          <Tooltip title='Board List'>
            <AppsIcon sx={{ color: "white", verticalAlign: "middle" }} />
          </Tooltip>
        </Link>
        {/* <img src={trelloLogo} width={24} height={24} alt="Trello" /> */}
        <Link to='/'>
          <Box
            sx={{
              width: "100%",
              height: (theme) => theme.trello.boardBarHeight,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SvgIcon
              component={TrelloIcon}
              inheritViewBox
              fontSize='small'
              sx={{ color: "white" }}
            />
            <Typography
              variant='span'
              sx={{
                fontSize: "1.2rem",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Trello
            </Typography>
          </Box>
        </Link>

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Workspaces />
          <Recent />
          <Started />
          <Templates />
          <Button
            sx={{
              color: "white",
            }}
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box
        px={2}
        sx={{
          width: "100%",
          height: (theme) => theme.trello.boardBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
        gap={3}
      >
        {/* Search Boarb */}
        <AutoCompleteSearchBoard />

        {/* Dark - Light Mode */}
        <ModeSelect />

        {/* Xử lý hiển thi các thông báo */}
        <Notifications />

        <Tooltip title='Help'>
          <HelpOutlineIcon sx={{ cursor: "pointer", color: "white" }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
};

export default AppBar;
