import transactionModel from "./transactionSchema.js";

export const createTransaction = (tObj) => {
  return transactionModel(tObj).save();
};

export const getTransaction = (filter) => {
  return transactionModel.find(filter);
};

export const deleteTransaction = (filter) => {
  return transactionModel.deleteMany(filter);
};
