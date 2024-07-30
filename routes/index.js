

const express = require("express");
const registerUser = require("../controllers/registerUser.js");
const checkEmail = require("../controllers/checkEmail.js");
const checkPassword = require("../controllers/checkPassword.js");
const userDetails = require("../controllers/userDetails.js");
const logout = require("../controllers/logout.js");
const updateUserDetails = require("../controllers/updateUserdetails.js");
const searchUser = require("../controllers/searchUser.js");

const router = express.Router();

// create user api
router.post("/register" , registerUser);
// check user email
router.post("/email" , checkEmail);
// check password
router.post("/password" , checkPassword);
// login user details
router.get("/userDetails" , userDetails);
// logout session
router.get("/logout",logout);
// update user details
router.post("/updateUser", updateUserDetails);
// Search User
router.post("/searchUser" , searchUser)

module.exports = router;