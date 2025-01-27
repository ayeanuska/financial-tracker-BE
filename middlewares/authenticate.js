import jwt from "jsonwebtoken";
import { getUserByEmail } from "../models/user/UserModel.js";

export const authenticate = async (req, res, next) => {
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

      //3.2 add user data to request
      if (userData) {
        req.userData = userData;
        //4. go to next process
        next();
      } else {
        const errObj = {
          status: "error",
          message: "Authentication Failed",
        };

        return res.status(401).send(errObj);
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
};
