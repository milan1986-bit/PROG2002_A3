// web server for the admin website
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log("Admin website running in " + PORT);
});
