
const UserModel = require("../models/userModel.js");
const bcryptjs = require("bcryptjs");

async function registerUser( req , res){

    try{
        let {name , email , password , profile_pic} = req.body;

        // Check is email already exist or not
        let checkEmail = await UserModel.findOne({email})
        if(checkEmail){
            return res.status(400).json({
                message: "This email already exists !",
                error: true,
            })
        }

        // Now convert our password to hash password
        const salt =  await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password,salt);

        const payload = {
            name,
            email,
            profile_pic,
            password: hashPassword,
        }

        const user = new UserModel(payload);
        const userSave = await user.save();

        return res.status(201).json({
            message: "User created Successfully",
            data: userSave,
            success: true
        })

    }
    catch(err){
        return res.status(400).json({
            message: err.message || err,
            err: true,
        })
    }
}

module.exports = registerUser;