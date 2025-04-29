const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../model/userModel");

module.exports = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }
  const decoded = await promisify(jwt.verify)(token, "1122@tailer");
  const currentUser = await User.findById(decoded?.user?._id)
    .select("+password")
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401,
      ),
    );
  }
  req.user = currentUser;
  return next();
});
