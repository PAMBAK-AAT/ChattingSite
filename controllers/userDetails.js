
const getUserdetail = require("../helper/getUserDetailfromToken");

async function userDetails(req , res){

    try {

        const token = req.cookies.token || "";
        // call a function to get details from this token
        const user = await getUserdetail(token);

        return res.status(200).json({
            message: "User details",
            data: user
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            err: true
        })
    }
}

module.exports = userDetails;