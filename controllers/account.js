const bcyrpt = require("bcrypt");
const asynHandler = require("../middleware/async")
const GlobalModel = require("../model/Global")
;
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");



exports.CreateUser = asynHandler(async (req, res, next) => {
    const salt = await bcyrpt.genSalt(10);
    payload = req.body
    payload.status = 1
    payload.role = 'admin'
    payload.password = await bcyrpt.hash(req.body.password, salt);
    let results = await GlobalModel.Create(payload, 'user_profile','user_id');
    if (results.rowCount == 1) {
        // CatchHistory({ payload: JSON.stringify({firstname:payload.first_name,lastname:payload.last_name}), api_response: `New user signup with id :${id}`, function_name: 'CreateUser', date_started: systemDate, sql_action: "INSERT", event: "User Signup", actor: id }, req)

        return sendResponse(res, 1, 200, "Record saved", [])
    } else {
        // CatchHistory({ payload: JSON.stringify({firstname:payload.first_name,lastname:payload.last_name}), api_response: `Sorry, error saving record for user  with id :${id}`, function_name: 'CreateUser', date_started: systemDate, sql_action: "INSERT", event: "User Signup", actor: id }, req)

        return sendResponse(res, 0, 200, "Sorry, error saving record", [])
    }

})