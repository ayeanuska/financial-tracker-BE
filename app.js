import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongoDB } from "./config/mongoconfig.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

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
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }

  // createdAt:{
  //     type:Date,
  //     default:now(),
  // }
);

const User = mongoose.model("user", userSchema);

app.post("/api/v1/users/register", async (req, res) => {
  try {
    //   const newUser = new User(req.body);

    const { username, email } = req.body;
    let { password } = req.body;

    const saltRound = 10;
    password = await bcrypt.hash(password, saltRound);

    const newUser = new User({
      username,
      email,
      password,
    });
    const data = await newUser.save();

    res.status(201).json({
      status: "success",
      message: "user created",
      data,
    });
  } catch (error) {
    console.log(error.message);

    if (error?.message.includes("E11000")) {
      res.status(400).json({
        status: "error",
        message: "Duplicate userr",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Erorr creating user",
      });
    }
  }
});

app.post("/api/v1/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    if (userData) {
      const loginSuccess = await bcrypt.compare(password, userData.password);

      if (loginSuccess) {
        res.status(200).json({
          status: "success",
          message: " Login succesfull",
        });
      } else {
        res.status(403).json({
          status: "error",
          message: "credidentials not found",
        });
      }
    } else {
      res.status(404).json({
        status: "error",
        message: "USer not found",
      });
    }
  } catch (error) {
    res.send.status(500).json({
      status: "error",
      message: "login error",
    });
  }
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server running at http://localhost:${PORT}`);
});
