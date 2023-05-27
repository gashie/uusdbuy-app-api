const express = require("express");
const router = express.Router();


//USER MANAGEMENT
const {
 CreateUser,
} = require("../controllers/account");
//USER AUTH
const {
    Auth, VerifyUser, Logout,
   } = require("../controllers/auth");

const { userSetup } = require("../middleware/validator");
const { protect } = require("../middleware/protect");




router.route("/addaccount").post(userSetup,CreateUser);
//user login auth
router.route("/login").post(Auth);
router.route("/auth").post(protect, VerifyUser);
router.route("/logout").post(protect,Logout);
module.exports = router;
