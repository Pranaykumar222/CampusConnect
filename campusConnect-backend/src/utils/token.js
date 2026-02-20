import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";

export const generateAccessToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: "15m"}
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        {id:userId},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:"7d"}
    )
}
