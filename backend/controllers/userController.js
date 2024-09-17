import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered!");
});

// export const login = catchAsyncErrors(async (req, res, next) => {
//   const { email, password, role } = req.body;
//   if (!email || !password || !role) {
//     return next(new ErrorHandler("Please provide email ,password and role."));
//   }
//   const user = await User.findOne({ email }).select("+password");
//   if (!user) {
//     return next(new ErrorHandler("Invalid Email Or Password.", 400));
//   }
//   const isPasswordMatched = await user.comparePassword(password);
//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("Invalid Email Or Password.", 400));
//   }
//   if (user.role !== role) {
//     return next(
//       new ErrorHandler(`User with provided email and ${role} not found!`, 404)
//     );
//   }
//   sendToken(user, 201, res, "User Logged In!");
// });
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role.", 400));
  }

  // Find the user by email and select the password field explicitly
  const user = await User.findOne({ email }).select("+password");

  // If the user does not exist, return an error
  if (!user) {
    console.log('User not found:', email);
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  // Compare the entered password with the hashed password stored in the database
  const isPasswordMatched = await user.comparePassword(password);
  console.log('Entered Password:', password);
  console.log('Hashed Password:', user.password);
  console.log('Password Match:', isPasswordMatched);

  // If the password does not match, return an error
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  // Check if the user's role matches the role provided in the request
  if (user.role !== role) {
    return next(new ErrorHandler(`User with provided email and ${role} not found!`, 404));
  }

  // If all checks pass, send a token in the response
  sendToken(user, 201, res, "User Logged In!");
});
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});