

const getUserdetail = require("../helper/getUserDetailfromToken");
const UserModel = require("../models/userModel");


async function updateUserDetails(req , res){

    try {
        
        const token = req.cookies.token || "";
        const user = await getUserdetail(token);
        console.log("User retrieved from token",user);

        if(!user || !user._id){
            return res.status(404).json({
                message: "User not found",
                error: true
            })
        }

        const {name,profile_pic,email} = req.body;

        const updateUser = await UserModel.updateOne(
            {_id:user._id},
            {name,profile_pic,email}
        );
        
        const userInfo = await UserModel.findById(user._id);

        return res.status(200).json({
            message: "Updated Successfully",
            data: userInfo,
            success: true
        })

    }catch (err) {
        return res.status(500).json({
            message: err.message || err,
            err: true
        })
    }
}

module.exports = updateUserDetails;