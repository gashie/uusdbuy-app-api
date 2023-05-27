const asynHandler = require("../middleware/async");

const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const GlobalModel = require("../model/Global")
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");

exports.UserSignup = asynHandler(async (req, res, next) => {
    //check if user exist
    let payload = req.body
    payload.registration_status = 1
    let results = await GlobalModel.Create(payload, 'user_profile','user_id');
    if (results.rowCount == 1) {
        CatchHistory({ payload: JSON.stringify(payload), api_response: `New user added`, function_name: 'UserSignup', date_started: systemDate, sql_action: "INSERT", event: "Create User", actor: 'userData.id' }, req)
        return sendResponse(res, 1, 200, "Record saved", [])
    }else{
        CatchHistory({ payload: JSON.stringify(payload), api_response: `Sorry, error saving record: contact administrator`, function_name: 'UserSignup', date_started: systemDate, sql_action: "INSERT", event: "Create User", actor: 'userData.id' }, req)
       return sendResponse(res, 0, 200, "Sorry, error saving record: contact administrator", [])

    }

})


exports.ViewUsers = asynHandler(async (req, res, next) => {
  
    let results = await GlobalModel.Find('user_profile');
    if (results.rows.length == 0) {
        // CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantCategory', date_started: systemDate, sql_action: "SELECT", event: "Category View", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    // CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} category record's`, function_name: 'ViewTenantCategory', date_started: systemDate, sql_action: "SELECT", event: "Category View", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})

exports.ViewDeleted = asynHandler(async (req, res, next) => {
  
    let results = await GlobalModel.ViewDeleted('user_profile');
    if (results.rows.length == 0) {
        // CatchHistory({ api_response: "No Record Found", function_name: 'ViewTenantCategory', date_started: systemDate, sql_action: "SELECT", event: "Category View", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Sorry, No Record Found", [])
    }
    // CatchHistory({ api_response: `User with ${userData.id} viewed ${results.rows.length} category record's`, function_name: 'ViewTenantCategory', date_started: systemDate, sql_action: "SELECT", event: "Category View", actor: userData.id }, req)

    sendResponse(res, 1, 200, "Record Found", results.rows)
})


exports.UpdateUserAccount = asynHandler(async (req, res, next) => {
      let payload = req.body
      payload.updated_at = systemDate
     const runupdate = await GlobalModel.Update(payload,'user_profile','user_id',payload.user_id)
    if (runupdate.rowCount == 1) {
        // CatchHistory({ payload: JSON.stringify(payload), api_response: `User with id :${userData.id} updated category to ${cat_name}`, function_name: 'UpdateCategory', date_started: systemDate, sql_action: "UPDATE", event: "Update Category", actor: userData.id }, req)
        return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])
     } else {
        // CatchHistory({ payload: JSON.stringify(payload), api_response: `Update failed, please try later-User with id :${userData.id} updated category to ${cat_name}`, function_name: 'UpdateCategory', date_started: systemDate, sql_action: "UPDATE", event: "Update Category", actor: userData.id }, req)
        return sendResponse(res, 0, 200, "Update failed, please try later", [])
    }
})

exports.UndoDelete = asynHandler(async (req, res, next) => {
    let { del,user_id} = req.body;
    let decide = del == 1 ? systemDate : null

    let payload = {
        updated_at  :systemDate,
        deleted_at:decide
    }
    // payload.updated_at = systemDate
    // payload.deleted_at = null
   const runupdate = await GlobalModel.Update(payload,'user_profile','user_id',user_id)
  if (runupdate.rowCount == 1) {
      // CatchHistory({ payload: JSON.stringify(payload), api_response: `User with id :${userData.id} updated category to ${cat_name}`, function_name: 'UpdateCategory', date_started: systemDate, sql_action: "UPDATE", event: "Update Category", actor: userData.id }, req)
      return sendResponse(res, 1, 200, "Record Updated",runupdate.rows[0])
   } else {
      // CatchHistory({ payload: JSON.stringify(payload), api_response: `Update failed, please try later-User with id :${userData.id} updated category to ${cat_name}`, function_name: 'UpdateCategory', date_started: systemDate, sql_action: "UPDATE", event: "Update Category", actor: userData.id }, req)
      return sendResponse(res, 0, 200, "Update failed, please try later", [])
  }
})