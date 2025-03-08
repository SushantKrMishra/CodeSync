import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.js";
import { userAuthMiddleware } from "./middlewares/userAuth.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use("/open", userAuthRoutes);
app.use("/api", userAuthMiddleware, userRoutes);
app.use("/connection", userAuthMiddleware, connectionRoutes);
app.use("/feed", userAuthMiddleware, feedRoutes);

app.use("/", (err, req, res, next) => {
  if (err) {
    //TODO: Error logging with stack
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//Connect to DB and then Listen
connectDB()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err, "unable to connect");
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on ${port}`);
    });
  });
