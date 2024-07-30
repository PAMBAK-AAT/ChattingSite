
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const getUserdetail = async (token) => {
    try {
        if (!token) {
            console.log("No token provided");
            return {
                message: "Session out!",
                logout: true
            };
        }

        // If token exists
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY); // here we get {id, email}
        console.log("Decoded token:", decode);

        const user = await UserModel.findById(decode.id).select("-password");
        console.log("User retrieved from database:", user);

        return user;
    } catch (err) {
        console.log("Error in getUserdetail:", err);
        return null;
    }
}

module.exports = getUserdetail;
