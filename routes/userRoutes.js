import express from "express";

import { createUser, getUserByEmail } from "../models/user/UserModel.js";

// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { compareText, encryptText } from "../utils/bcrypt.js";
import { jwtSign } from "../utils/jwt.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    //   const newUser = new User(req.body);

    const { username, email } = req.body;
    let { password } = req.body;

    const saltRound = 10;
    password = await encryptText(password);

    const data = await createUser({
      username,
      email,
      password,
    });

    return res.status(201).json({
      status: "success",
      message: "user created",
      data,
    });
  } catch (error) {
    console.log(error.message);

    if (error?.message.includes("E11000")) {
      next({
        statusCode: 400,
        message: "Duplicate userr",
      });
    } else {
      next({
        statusCode: 500,
        message: "Erorr creating user",
      });
    }
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userData = await getUserByEmail(email);

    if (userData) {
      const loginSuccess = await compareText(password, userData.password);

      const tokenData = {
        email: userData.email,
      };

      const token = await jwtSign(tokenData, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      if (loginSuccess) {
        return res.status(200).json({
          status: "success",
          message: " Login succesfull",
          accessToken: token,
        });
      } else {
        next({
          statusCode: 403,
          message: "User not found",
        });
      }
    } else {
      next({
        statusCode: 404,
        message: "User not found",
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: "login error",
    });
  }
});

export default router;
