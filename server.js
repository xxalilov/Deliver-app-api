const path = require("path");
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
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
const orderHistoryRoute = require("./routes/orderHistory");
const deliverBonusRoute = require("./routes/deliverBonus");
const userBonusRoute = require("./routes/userBonus");

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

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Files folder
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public", "uploads"))
);

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
app.use("/api/v1/orderhistory", orderHistoryRoute);
app.use("/api/v1/bonuses/deliver", deliverBonusRoute);
app.use("/api/v1/bonuses/user", userBonusRoute);
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
