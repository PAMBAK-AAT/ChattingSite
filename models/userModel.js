

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    name:{
        type: String,
        required: [true,"provide name"]
    },
    email:{
        type: String,
        required: [true,"provide email"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "provide password"],
    },
    profile_pic: {
        type: String,
        default: "",
    }
},{
    timestamps: true
});

///  When you set timestamps: true, Mongoose will automatically add two fields to your schema:
// createdAt: A Date field that records when the document was first created.
// updatedAt: A Date field that records the last time the document was updated.


const UserModel = mongoose.model("User" , userSchema); // User --> table name , UserModel --> It's the model
module.exports = UserModel;