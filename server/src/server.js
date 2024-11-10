import express from "express";

const app = express();
const hostname = "localhost";
const PORT = 8888;

app.get("/", function (req, res) {
  res.send("<h1>Hello World</h1>");
});

app.listen(PORT, hostname, () => {
  console.log(`Server is running server at http://${hostname}:${PORT}`);
});
