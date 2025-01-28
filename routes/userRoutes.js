import express from "express";

import { createUser, getUserByEmail } from "../models/user/UserModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    //   const newUser = new User(req.body);

    const { username, email } = req.body;
    let { password } = req.body;

    const saltRound = 10;
    password = await bcrypt.hash(password, saltRound);

    const data = await createUser({
      username,
      email,
      password,
    });

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await getUserByEmail(email);

    if (userData) {
      const loginSuccess = await bcrypt.compare(password, userData.password);

      const tokenData = {
        email: userData.email,
      };

      const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      if (loginSuccess) {
        res.status(200).json({
          status: "success",
          message: " Login succesfull",
          accessToken: token,
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
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "login error",
    });
  }
});

export default router;
