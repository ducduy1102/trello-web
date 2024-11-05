import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const MENU_STYLES = {
  color: "white",
  bgcolor: "transparent",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    bgcolor: "primary.50",
  },
};

const BoardBar = () => {
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
        borderBottom: "1px solid white",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="Evil Shadow Icon"
          clickable
          // onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add to Drive Workspace"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filter"
          clickable
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "white",
            },
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            "& .MuiAvatar-root": {
              width: 33,
              height: 33,
              fontSize: 16,
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-type": { bgcolor: "#a4b0be" },
            },
          }}
        >
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://i.ebayimg.com/images/g/hagAAOSwM7tjNl5u/s-l1200.jpg"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://images.unsplash.com/photo-1730337904190-20012bf4aa18?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://images.unsplash.com/photo-1730454947290-492fb500eabf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://images.unsplash.com/photo-1730326936991-3592547b7d26?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDZ8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://images.unsplash.com/photo-1719216323141-0490fa1989e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://images.unsplash.com/photo-1730322477687-7287e8ab4d55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI4fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://images.unsplash.com/photo-1730277400938-f00e87a5fe28?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI5fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://i.ebayimg.com/images/g/hagAAOSwM7tjNl5u/s-l1200.jpg"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://i.ebayimg.com/images/g/hagAAOSwM7tjNl5u/s-l1200.jpg"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://i.ebayimg.com/images/g/hagAAOSwM7tjNl5u/s-l1200.jpg"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://i.ebayimg.com/images/g/hagAAOSwM7tjNl5u/s-l1200.jpg"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://i.ebayimg.com/images/g/hagAAOSwM7tjNl5u/s-l1200.jpg"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://i.ebayimg.com/images/g/hagAAOSwM7tjNl5u/s-l1200.jpg"
            />
          </Tooltip>
          <Tooltip title="evilshadow">
            <Avatar
              alt="Evil Shadow"
              src="https://i.ebayimg.com/images/g/hagAAOSwM7tjNl5u/s-l1200.jpg"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
};

export default BoardBar;
