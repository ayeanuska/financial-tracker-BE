import jwt from "jsonwebtoken";

export const jwtSign = async (SignData) => {
  return jwt.sign(SignData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIREsIN,
  });
};

export const jwtVerify = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
