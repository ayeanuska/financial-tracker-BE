import mongoose from "mongoose";

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

export default mongoose.model("user", userSchema);
