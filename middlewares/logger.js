export const logger = (req, res, next) => {
  console.log("logging");
  next();
};
