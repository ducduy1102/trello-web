import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGoToBoard = () => {
    navigate("/board"); // Điều hướng đến trang Board
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          bgcolor: "ButtonFace",
          flexDirection: "column",
        }}
        variant="h1"
      >
        Home Page
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleGoToBoard} // Gọi hàm điều hướng khi bấm
        >
          Go to Board Page
        </Button>
      </Typography>
    </Container>
  );
};

export default Home;

// import Container from "@mui/material/Container";
// import Typography from "@mui/material/Typography";
// import Link from "@mui/material/Link"; // Link từ MUI
// import { Link as RouterLink } from "react-router-dom"; // Link từ React Router

// const Home = () => {
//   return (
//     <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
//       <Typography
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//           bgcolor: "ButtonFace",
//           flexDirection: "column",
//         }}
//         variant="h1"
//       >
//         Home Page
//         <Link
//           component={RouterLink} // Kết hợp Link từ MUI với React Router
//           to="/board" // Điều hướng đến trang Board
//           sx={{
//             mt: 2,
//             fontSize: "1.5rem",
//             textDecoration: "none",
//             color: "primary.main",
//             "&:hover": {
//               textDecoration: "underline",
//             },
//           }}
//         >
//           Go to Board Page
//         </Link>
//       </Typography>
//     </Container>
//   );
// };

// export default Home;
