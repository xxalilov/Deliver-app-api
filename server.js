const path = require("path");
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
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
const subadminRoute = require("./routes/subadmin");
const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");
const orderRoute = require("./routes/order");
const deliverRoute = require("./routes/deliver");
const reviewRoute = require("./routes/review");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

// Body Parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

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
app.use("/api/v1/subadmins", subadminRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/delivers", deliverRoute);
app.use("/api/v1/reviews", reviewRoute);
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

const io = require("./utils/socket").init(server);
io.on("connection", (socket) => {
  console.log("Client connected");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
