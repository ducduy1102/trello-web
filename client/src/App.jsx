import Button from "@mui/material/Button";
import { pink } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import AccessAlarm from "@mui/icons-material/AccessAlarm";
import ThreeDRotation from "@mui/icons-material/ThreeDRotation";
import Home from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";

function App() {
  return (
    <>
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
