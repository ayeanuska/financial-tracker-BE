import userModel from "./UserSchema.js";

//to create a user
export const createUser = (userObj) => {
  return userModel(userObj).save();
};

// read user
export const getUserByEmail = (email) => {
  return userModel.findOne({ email });
};
