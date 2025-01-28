import express from "express";
import cors from "cors";
import { authenticate } from "./middlewares/authenticate.js";

import { connectMongoDB } from "./config/mongoconfig.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// import { createUser, getUserByEmail } from "./models/user/UserModel.js";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
} from "./models/transaction/transactionModel.js";

import userRouter from "./routes/userRoutes.js";

import transRouter from "./routes/transactionRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

//connect to mongoosedb
connectMongoDB();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());

//route
app.get("/", (req, res) => {
  res.json({
    message: "its live",
  });
});

//data base models
//user router
app.use("/api/v1/users", userRouter);
//transaction router
app.use("/api/v1/transactions", transRouter);

//error handler middlewarre
app.use(errorHandler);

// start server
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server running at http://localhost:${PORT}`);
});
