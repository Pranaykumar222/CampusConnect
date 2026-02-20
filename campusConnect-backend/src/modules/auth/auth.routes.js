import express from "express";
import { register,login,refreshAccessToken,verifyEmail,resendOtp,forgotPassword,resetPassword} from "../auth/auth.controller.js";
import { googleLogin } from "../auth/google-auth.controller.js";

const router = express.Router();

router.post('/register',register);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);

router.post('/login',login);
router.post('/refresh',refreshAccessToken);

router.post('/forgot-password',forgotPassword),

router.post('/reset-password',resetPassword);


router.post("/google", googleLogin);


export default router;
