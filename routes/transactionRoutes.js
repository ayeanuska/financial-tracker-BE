import express from "express";

import {
  createTransaction,
  deleteTransaction,
  getTransaction,
} from "../models/transaction/transactionModel.js";

import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// create transaction
router.post("/", authenticate, async (req, res) => {
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

    res.status(201).json({
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
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// gettransaction
router.get("/", authenticate, async (req, res) => {
  //try catch
  try {
    // if (userData) {
    //   //4. get transction
    const transactionData = await getTransaction({
      userId: req.userData._id,
    });

    res.status(201).json({
      status: "success",
      message: "transaction created",
      transaction: transactionData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

//delete api
router.delete("/:tid", authenticate, async (req, res) => {
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
      res.status(201).json({
        status: "success",
        message: transactionData,
      });
    } else {
      res.status(401).json({
        status: "error",
        message: " error while deleting",
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

router.delete("/", authenticate, async (req, res) => {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
