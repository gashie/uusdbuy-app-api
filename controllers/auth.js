const bcrypt = require("bcrypt");
const asynHandler = require("../middleware/async");
const Model = require("../model/Account")
const { sendResponse, sendCookie, clearResponse, CatchHistory } = require("../helper/utilfunc");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

// @desc Login controller
// @route POST /auth
// @access Public
exports.Auth = asynHandler(async (req, res) => {
    const { email, password } = req.body

    //search for user in db
    const foundUser = await Model.auth(email)
    let UserDbInfo = foundUser.rows[0]

    if (!UserDbInfo) {
        // CatchHistory({ payload: JSON.stringify({ email }), api_response: "Unauthorized access-email not in database", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: email }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')

    }


    //check for password
    const match = await bcrypt.compare(password, UserDbInfo.password)

    if (!match) {
        CatchHistory({ payload: JSON.stringify({ email }), api_response: "Unauthorized access-user exist but password does not match", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: email }, req)
        return sendResponse(res, 0, 401, 'Unauthorized access')
    }
    let UserInfo = {
        id: UserDbInfo.id,
        name: UserDbInfo.full_name,
        email: UserDbInfo.email,
        staff: UserDbInfo.status,

    }
    // CatchHistory({ payload: JSON.stringify({ email }), api_response: "User logged in", function_name: 'Auth', date_started: systemDate, sql_action: "SELECT", event: "User Authentication", actor: email }, req)
    return sendCookie(UserInfo, 1, 200, res, req)
})


exports.VerifyUser = asynHandler(async (req, res, next) => {
    let userData = req.user;
    CatchHistory({  api_response: "User is verified", function_name: 'VerifyUser', date_started: systemDate, sql_action: "SELECT", event: "Get User Info", actor: userData.id }, req)

    return sendResponse(res, 1, 200, "Loggedin", userData)
});


exports.Logout = asynHandler(async (req, res, next) => {
    CatchHistory({  api_response: "User is logged out", function_name: 'Logout', date_started: systemDate, sql_action: "SELECT", event: "Logout", actor: req.user.id }, req)
    return clearResponse(req, res)
});