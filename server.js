const path = require("path");
const express = require("express");
const { logger } = require("./middleware/logEvents");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 3500;

app.use(logger);

// Cross Origin Resource Sharing (CORS

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3500",
  "https://www.yoursite.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(PORT, () => console.log(`app running on Port: ${PORT} ...`));
