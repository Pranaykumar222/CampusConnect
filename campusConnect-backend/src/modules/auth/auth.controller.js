import * as authService from "./auth.service.js";

const handleError = (res, error) => {
  return res.status(400).json({
    success: false,
    message: error.message,
  });
};

export const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Verification code sent to email",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    await authService.verifyEmailOtp(req.body);

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const resendOtp = async (req, res) => {
  try {
    await authService.resendOtpService(req.body.email);

    res.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);


    res.json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPasswordService(req.body.email);

    res.json({
      success: true,
      message: "Password reset OTP sent",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    await authService.resetPasswordService(req.body);

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const token = await authService.refreshAccessTokenService(
      req.body.refreshToken
    );

    res.json({
      success: true,
      accessToken: token,
    });
  } catch (error) {
    handleError(res, error);
  }
};
