import express from "express";

import {
  createTransaction,
  deleteTransaction,
  getTransaction,
} from "../models/transaction/transactionModel.js";

import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// create transaction
router.post("/", authenticate, async (req, res, next) => {
  //try catch
  try {
    // if (userData) {
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
    // console.log(userData);
    const newData = await createTransaction({
      userId: req.userData._id,
      type,
      description,
      amount,
      date,
    });

    return res.status(201).json({
      status: "success",
      message: "transaction created",
      transaction: newData,
    });
    // } else {
    //   res.send(401).json({
    //     status: "error",
    //     message: "user not found",
    //   });
    // }
  } catch (error) {
    next({
      statusCode: 500,
      message: "Cannot create transactions",
    });
    // res.status(500).json({
    //   status: "error",
    //   message: error.message,
    // });
  }
});

// gettransaction
router.get("/", authenticate, async (req, res, next) => {
  //try catch
  try {
    // if (userData) {
    //   //4. get transction
    console.log(1111, req.userData);
    const transactionData = await getTransaction({
      userId: req.userData._id,
    });

    return res.status(201).json({
      status: "success",
      message: "transaction created",
      transaction: transactionData,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
    });
  }
});

//delete api
router.delete("/:tid", authenticate, async (req, res, next) => {
  try {
    // if (userData) {
    //4. find the transaction with user id and teansaction id from the parameter

    const transactionId = req.params.tid;
    // const transactionData = await Transaction.findOneAndDelete({
    //   _id: transactionId,
    //   userId: userData._id,
    // });

    const transactionData = await deleteTransaction({
      _id: transactionId,
      userId: req.userData._id,
    });

    if (transactionData) {
      return res.status(201).json({
        status: "success",
        message: transactionData,
      });
    } else {
      next({
        statusCode: 401,
        message: "error while deleting",
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
    });
  }
});

//del many

router.delete("/", authenticate, async (req, res, next) => {
  try {
    // if (userData) {
    //4. find the transaction with user id and teansaction id from the parameter

    const transactions = req.body.transactions;
    const transactionData = await deleteTransaction({
      _id: { $in: transactions },
      userId: req.userData._id,
    });

    console.log(9000, transactionData);
    if (transactionData) {
      return res.status(201).json({
        status: "success",
        message: "transaction deleted",
        transactionData,
      });
    } else {
      next({
        statusCode: 401,
        message: " error deleting transaction data",
      });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
    });
  }
});

export default router;
