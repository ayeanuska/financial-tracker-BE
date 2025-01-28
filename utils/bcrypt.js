import bcrypt from "bcrypt";

const SALT_ROUND = 10;

export const encryptText = (inputText) => {
  return bcrypt.hash(inputText, SALT_ROUND);
};

export const compareText = async (plaintext, encryptText) => {
  return bcrypt.compare(plaintext, encryptText);
};

export const calculateAge = (date) => any;
return age;
