const path = require("path");
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const multer = require("multer");
const { fileFilter, fileStorage } = require("./utils/file");

// require routes
const restaurantRoute = require("./routes/restaurant");
const mealRoute = require("./routes/meal");
const restauranTypeRoute = require("./routes/restaurantType");
const mealTypeRoute = require("./routes/mealType");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

// Body Parser
app.use(express.json());

// File uploads
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// Files folder
app.use("/public/images", express.static(path.join(__dirname, "public")));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/restaurants", restaurantRoute);
app.use("/api/v1/meals", mealRoute);
app.use("/api/v1/restauranttypes", restauranTypeRoute);
app.use("/api/v1/mealtypes", mealTypeRoute);
app.use(errorHandler);

// Add headers before the routes are defined
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}!`.yellow.bold
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
