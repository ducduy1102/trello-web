import { useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useConfirm } from "material-ui-confirm";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAPI, selectCurrentUser } from "@/redux/user/userSlice";
import { Link } from "react-router-dom";

const Profiles = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const confirmLogout = useConfirm();
  const handleLogout = () => {
    confirmLogout({
      title: "Log out of your account?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",
    })
      .then(() => {
        dispatch(logoutUserAPI());
      })
      .catch(() => {});
  };

  return (
    <Box>
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ padding: 0 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup='true'
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt='Evil Shadow'
            src={currentUser?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id='basic-menu-profiles'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button-profiles",
        }}
        sx={{ mt: 1 }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link to='/settings/account' style={{ color: "inherit" }}>
          <MenuItem
            sx={{
              "&:hover": {
                color: "success.light",
              },
            }}
          >
            <Avatar
              sx={{ width: 28, height: 28, mr: 2 }}
              alt='Evil Shadow'
              src={currentUser?.avatar}
            />
            Profile
          </MenuItem>
        </Link>
        {/* <MenuItem>
          <Avatar
            sx={{ width: 28, height: 28, mr: 2 }}
            alt="Evil Shadow"
            src="https://i.ebayimg.com/images/g/hagAAOSwM7tjNl5u/s-l1200.jpg"
          />{" "}
          My account
        </MenuItem> */}
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            "&:hover": {
              color: "warning.dark",
              "& .loggout-icon": {
                color: "warning.dark",
              },
            },
          }}
        >
          <ListItemIcon>
            <Logout className='loggout-icon' fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profiles;
