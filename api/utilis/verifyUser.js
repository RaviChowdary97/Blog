import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(400, "Unauthorized "));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(errorHandler(400, "Unauthorized "));
    }
    req.user = user;
    next();
  });
};
