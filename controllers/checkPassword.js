

const UserModel = require("../models/userModel");
const bcryptjs = require("bcryptjs"); // bcryptjs: This library is used for hashing and comparing passwords.
const jwt = require("jsonwebtoken");// This library is used to create and verify JSON Web Tokens (JWT), commonly used for authentication.

async function checkPassword(req , res){

    try{

        const {password,userId} = req.body;
        const user = await UserModel.findById(userId);

        if(!user){
            return res.status(404).json({
                message: "User not exist",
                error: true
            })
        }
    
        const verifyPassword = await bcryptjs.compare(password , user.password);
    
        if(!verifyPassword){
            return res.status(400).json({
                message: "Password not verified",
                error: true
            })
        }

/// tokenData: The data to be encoded in the JWT, here it includes the user's ID and email.
/// jwt.sign: It creates a JWT using the secret key stored in process.env.JWT_SECRET_KEY and sets an expiration time of 1 day.
        const tokenData = {
            id: user._id,
            email: user.email
        };

        const token =  jwt.sign(tokenData , process.env.JWT_SECRET_KEY,{ expiresIn: "3d"});

        const cookieOptions = {
            
            httpOnly: true, // This is crucial to protect the cookie from being stolen by malicious scripts.
            // httpOnly means that it cannot be accessed via JavaScript running on the client side. 

            secure: true //  Ensures the cookie is sent only over HTTPS.
            // Security Concerns: Local Storage and Session Storage are more susceptible to XSS attacks 
            // since JavaScript can access them. While these storages are easy to implement,
            // they pose a higher security risk compared to cookies with the httpOnly attribute.
        }
    
        // res.cookie: Sets the JWT in a cookie
        return res.cookie('token',token,cookieOptions).status(200).json({ 
            message: "Password verified , Login Successfully!",
            token: token,
            success: true
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message || err,
            err: true
        })
    }

}

module.exports = checkPassword;