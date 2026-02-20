import { OAuth2Client } from "google-auth-library";
import User from "../user/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const idToken = req.body.idToken || req.body.token;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const {
      email,
      given_name,
      family_name,
      picture,
    } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not available",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.authProvider === "local") {
        user.authProvider = "google";
        user.emailVerified = true;

        if (picture && !user.avatar) {
          user.avatar = picture;
        }

        await user.save();
      }
    } else {
      user = await User.create({
        firstName: given_name || "Google",
        lastName: family_name || "User",
        email,
        emailVerified: true,
        avatar: picture,
        authProvider: "google",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          authProvider: user.authProvider,
        },
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);

    res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};
