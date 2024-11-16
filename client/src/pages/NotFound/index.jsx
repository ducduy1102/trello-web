// Boards Detail
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const NotFound = () => {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          bgcolor: "ButtonFace",
        }}
        variant="h1"
      >
        Page Not Found
      </Typography>
    </Container>
  );
};

export default NotFound;
