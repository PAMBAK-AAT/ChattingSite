


const UserModel = require('../models/userModel');

async function searchUser(req , res){
    try {
        const { search } = req.body;

        const query = new RegExp(search , "i" , "g"); 
        // Creates a new regular expression object. // search is the term to search for.
        // "i" is a flag that makes the search case-insensitive. // "g" is a flag for global search.

        const user = await UserModel.find({
            "$or" : [
                { name : query },
                { email : query }
            ]
            // "$or" is a MongoDB operator that performs a logical OR operation on the specified conditions.
        }).select("-password");

        return res.json({
            message : 'all user',
            data : user,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error ,
            error : true
        })
    }
}

module.exports = searchUser;