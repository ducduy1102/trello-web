import Box from "@mui/material/Box";
import Card from "./Card/Card";

const ListCards = () => {
  return (
    <Box
      sx={{
        p: "0 5px",
        m: "0 5px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowX: "hidden",
        overflowY: "auto",
        maxHeight: (theme) =>
          `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} 
          - ${theme.trello.columnHeaderHeight} - ${
            theme.trello.columnFooterHeight
          })`,
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ced0da",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#bfc2cf",
        },
      }}
    >
      <Card />
      {Array(6)
        .fill()
        .map((_, index) => (
          <Card key={`${index}-card`} hideMedia />
        ))}
    </Box>
  );
};

export default ListCards;

{
  /* <Card
sx={{
  cursor: "pointer",
  boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
  overflow: "unset",
}}
>
<CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
  <Typography>Card 01</Typography>
</CardContent>
</Card> */
}
