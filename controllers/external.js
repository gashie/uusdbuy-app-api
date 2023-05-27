const asynHandler = require("../middleware/async");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");



exports.ExternalRequest = asynHandler(async (req, res, next) => {

    await ApiCall(`${process.env.AuditUrl}api/v1/savelogs`, 'POST', ``, data)

    return sendResponse(res, 1, 200, "Record saved", [])


})