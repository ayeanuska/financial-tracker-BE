import express from "express";
import cors from "cors";

import { connectMongoDB } from "./config/mongoconfig.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";

import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "./models/user/UserModel.js";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
} from "./models/transaction/transactionModel.js";

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

app.post("/api/v1/users/register", async (req, res) => {
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

app.post("/api/v1/users/login", async (req, res) => {
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

// create transaction
app.post("/api/v1/transactions", async (req, res) => {
  //try catch
  try {
    console.log(101, req.headers);
    //1.get the token
    const token = req.headers.authorization;

    //2. verify the token
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED DATA", decodedData);

    if (decodedData?.email) {
      //3. find the user from decoded data
      const userData = await getUserByEmail(decodedData.email);

      if (userData) {
        //4. create transction
        const { type, description, amount, date } = req.body;
        // const newTransaction = new Transaction({
        //   userId: userData._id,
        //   type,
        //   description,
        //   amount,
        //   date,
        // });

        // const newData = await newTransaction.save();
        console.log(userData);
        const newData = await createTransaction({
          userId: userData._id,
          type,
          description,
          amount,
          date,
        });

        res.status(201).json({
          status: "success",
          message: "transaction created",
          transaction: newData,
        });
      } else {
        res.send(401).json({
          status: "error",
          message: "user not found",
        });
      }
    } else {
      res.send(401).json({
        status: "error",
        message: "Invalid Token",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// gettransaction
app.get("/api/v1/transactions", async (req, res) => {
  //try catch
  try {
    console.log(101, req.headers);
    //1.get the token
    const token = req.headers.authorization;

    //2. verify the token
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED DATA", decodedData);

    if (decodedData?.email) {
      //3. find the user from decoded data
      const userData = await getUserByEmail(decodedData.email);

      if (userData) {
        //4. get transction
        const transactionData = await getTransaction({
          userId: userData._id,
        });

        res.status(201).json({
          status: "success",
          message: "transaction created",
          transaction: transactionData,
        });
      } else {
        res.send(401).json({
          status: "error",
          message: "user not found",
        });
      }
    } else {
      res.send(401).json({
        status: "error",
        message: "Invalid Token",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

//delete api
app.delete("/api/v1/transactions/:tid", async (req, res) => {
  try {
    console.log(101, req.headers);
    //1.get the token
    const token = req.headers.authorization;

    //2. verify the token
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED DATA", decodedData);

    if (decodedData?.email) {
      //3. find the user from decoded data
      const userData = await getUserByEmail(decodedData.email);

      if (userData) {
        //4. find the transaction with user id and teansaction id from the parameter

        const transactionId = req.params.tid;
        // const transactionData = await Transaction.findOneAndDelete({
        //   _id: transactionId,
        //   userId: userData._id,
        // });

        const transactionData = await deleteTransaction({
          _id: transactionId,
          userId: userData._id,
        });

        if (transactionData) {
          res.status(201).json({
            status: "success",
            message: "transaction deleted",
          });
        } else {
          res.status(401).json({
            status: "error",
            message: " error while deleting",
          });
        }
      } else {
        res.send(401).json({
          status: "error",
          message: "user not found",
        });
      }
    } else {
      res.send(401).json({
        status: "error",
        message: "Invalid Token",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

//del many

app.delete("/api/v1/transactions", async (req, res) => {
  try {
    console.log(101, req.headers);
    //1.get the token
    const token = req.headers.authorization;

    //2. verify the token
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED DATA", decodedData);

    if (decodedData?.email) {
      //3. find the user from decoded data
      const userData = await getUserByEmail(decodedData.email);
      if (userData) {
        //4. find the transaction with user id and teansaction id from the parameter

        const transactions = req.body.transactions;
        const transactionData = await deleteTransaction({
          _id: { $in: transactions },
          userId: userData._id,
        });

        console.log(9000, transactionData);
        if (transactionData) {
          res.status(201).json({
            status: "success",
            message: "transaction deleted",
            transactionData,
          });
        } else {
          res.status(401).json({
            status: "error",
            message: " error deleting transaction data",
          });
        }
      } else {
        res.send(401).json({
          status: "error",
          message: "user not found",
        });
      }
    } else {
      res.send(401).json({
        status: "error",
        message: "Invalid Token",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server running at http://localhost:${PORT}`);
});
