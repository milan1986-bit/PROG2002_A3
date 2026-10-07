// web server for the client website
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;

//to serve static files (css, js, images)
app.use(express.static(__dirname));

//route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
//route to serve search.html
app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "search.html"));
});
//route to serve event.html
app.get("/event", (req, res) => {
  res.sendFile(path.join(__dirname, "event.html"));
});
//route to serve register.html
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.listen(PORT, () => {
  console.log("Client website running in " + PORT);
});
