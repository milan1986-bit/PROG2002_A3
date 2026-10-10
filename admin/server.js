// web server for the admin website
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8081;

//to serve static files (css, js)
app.use(express.static(__dirname));

//route to serve index.html (list of events)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
//route to serve add_event.html
app.get("/add_event", (req, res) => {
  res.sendFile(path.join(__dirname, "add_event.html"));
});
//route to serve update_event.html
app.get("/update_event", (req, res) => {
  res.sendFile(path.join(__dirname, "update_event.html"));
});
//route to serve categories.html
app.get("/categories", (req, res) => {
  res.sendFile(path.join(__dirname, "categories.html"));
});

app.listen(PORT, () => {
  console.log("Admin website running in " + PORT);
});
