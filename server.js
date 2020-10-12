const express = require("express");
const cookies = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/dbconnection");

const app = express();

// Enable Cors
app.use(cors());

// connecting to database
connectDB();

// Load Route files
const auth = require("./routes/api/auth");

// express body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// morgan middleware
app.use(morgan("tiny"));

// enable cookies
app.use(cookies());

// Mount Route files
app.use("/api/auth", auth);

app.get("/", (req, res) => {
  res.send("Employee Information Module");
});

const PORT = process.env.PORT || 7000;

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
