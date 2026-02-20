import User from "../user/user.model.js";
import EmailOtp from "./otp.model.js";
import { generateOtp } from "../../utils/otp.js";
import { sendOtpEmail } from "../../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";


const createAndSendOtp = async (email) => {
  await EmailOtp.deleteMany({ email });

  const otp = generateOtp();

  await EmailOtp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  await sendOtpEmail(email, otp);
};


export const registerUser = async (data) => {
  const {
    firstName,
    lastName,
    email,
    university,
    major,
    password,
    confirmPassword,
    isPrivate,
    termsAccepted,
  } = data;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !university ||
    !major ||
    !password ||
    !confirmPassword
  ) {
    throw new Error("All fields are required");
  }

  if (!termsAccepted) {
    throw new Error("You must accept Terms & Privacy Policy");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    firstName,
    lastName,
    email,
    university,
    major,
    password: hashedPassword,
    isPrivate: isPrivate ?? false,
    emailVerified: false,
  });

  await createAndSendOtp(email);

  return { email };
};


export const verifyEmailOtp = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const otpRecord = await EmailOtp.findOne({ email, otp });

  if (!otpRecord) {
    throw new Error("Invalid or expired OTP");
  }

  if (otpRecord.expiresAt < Date.now()) {
    await EmailOtp.deleteMany({ email });
    throw new Error("OTP expired");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  user.emailVerified = true;
  await user.save();

  await EmailOtp.deleteMany({ email });

  return true;
};


export const resendOtpService = async (email) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  if (user.emailVerified) {
    throw new Error("Email already verified");
  }

  await createAndSendOtp(email);

  return true;
};


export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");


  if (!user) throw new Error("User does not exist");

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.emailVerified) {
    throw new Error("Please verify your email first");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      university: user.university,
      major: user.major,
      isPrivate: user.isPrivate,
    },
  };
};


export const forgotPasswordService = async (email) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  if (!user.emailVerified) {
    throw new Error("Verify your email first");
  }

  await createAndSendOtp(email);

  return true;
};


export const resetPasswordService = async ({
  email,
  otp,
  newPassword,
  confirmPassword,
}) => {
  if (!email || !otp || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const otpRecord = await EmailOtp.findOne({ email, otp });

  if (!otpRecord) throw new Error("Invalid OTP");

  if (otpRecord.expiresAt < Date.now()) {
    await EmailOtp.deleteMany({ email });
    throw new Error("OTP expired");
  }

  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  await EmailOtp.deleteMany({ email });

  return true;
};


export const refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token required");

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  return generateAccessToken(decoded.id);
};
