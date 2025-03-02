import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 5001;

app.use("/open", userRoutes);

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
