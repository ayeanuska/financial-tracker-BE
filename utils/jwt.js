import jwt from "jsonwebtoken";

export const jwtSign = (signData) => {
  return jwt.sign(signData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

export const jwtVerify = (token) => {
  console.log(10000, token);
  return jwt.verify(token, process.env.JWT_SECRET);
};
