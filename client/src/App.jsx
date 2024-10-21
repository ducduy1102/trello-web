import Button from "@mui/material/Button";
import { pink } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import AccessAlarm from "@mui/icons-material/AccessAlarm";
import ThreeDRotation from "@mui/icons-material/ThreeDRotation";
import Home from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import SettingsBrightness from "@mui/icons-material/SettingsBrightness";
import Box from "@mui/material/Box";

function ModeSelect() {
  const { mode, setMode } = useColorScheme();
  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-mode">Mode</InputLabel>
      <Select
        labelId="label-select-mode"
        id="select-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LightModeIcon fontSize="small" /> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1, // 8px
            }}
          >
            <DarkModeOutlined fontSize="small" /> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2, // 16px
            }}
          >
            <SettingsBrightness fontSize="small" /> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const prefersDarkMode = useMediaQuery("prefers-color-scheme: dark");
  const prefersLightMode = useMediaQuery("prefers-color-scheme: light");
  console.log(
    "preferDarkMode",
    prefersDarkMode,
    "preferLightMode",
    prefersLightMode
  );

  return (
    <Button
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? "Turn dark" : "Turn light"}
    </Button>
  );
}

function App() {
  return (
    <>
      <ModeSelect />
      <hr />
      {/* Config Light/Dark Mode */}
      <ModeToggle />
      <hr />
      <Typography variant="body2" color="textSecondary">
        Hi
      </Typography>
      <Stack direction="row" spacing={3}>
        <Home />
        <Home color="primary" />
        <Home color="secondary" />
        <Home color="success" />
        <Home color="action" />
        <Home color="disabled" />
        <Home sx={{ color: pink[700] }} />
      </Stack>
      <br />
      <AccessAlarm />
      <br />
      <ThreeDRotation />
      <br />
      <div className="">Evil shadow </div>
      <br />
      <Button variant="contained">Hello world</Button>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </>
  );
}

export default App;
