const uuidV4 = require('uuid');
const GlobalModel = require("../model/Global");
const { sendResponse, CatchHistory } = require('./utilfunc');
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");
module.exports = {
    autoProcessQuantity: async (req,oldvalue,newvalue,action,product_id,user_id) => {
          let payload = {}
          let progress = 0
          if (action === 'add') {
            payload.prod_qty = Number(oldvalue)  + Number(newvalue)
          }else{
            payload.prod_qty = Number(oldvalue)  - Number(newvalue)
          }
            const runupdate = await GlobalModel.Update(payload, 'product', 'product_id', product_id)
            if (runupdate.rowCount == 1) {
                CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${user_id} updated product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
                return progress = 1
        
        
            } else {
                CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
                return progress = 0
            }


    },
    autoProcessOptionValueQuantity: async (req,oldvalue,newvalue,action,product_option_value_id,user_id) => {
        let payload = {}
        let progress = 0
        if (action === 'add') {
          payload.option_value_qty = Number(oldvalue)  + Number(newvalue)
        }else{
          payload.option_value_qty = Number(oldvalue)  - Number(newvalue)
        }
          const runupdate = await GlobalModel.Update(payload, 'product_option_values', 'product_option_value_id', product_option_value_id)
          if (runupdate.rowCount == 1) {
              CatchHistory({ payload: JSON.stringify(req.body), api_response: `User with id :${user_id} updated product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
              return progress = 1
      
      
          } else {
              CatchHistory({ payload: JSON.stringify(req.body), api_response: `Update failed, please try later-User with id :${user_id} tried to update product quantity}`, function_name: 'autoProcessQuantity', date_started: systemDate, sql_action: "UPDATE", event: "Update Prodcut Qty", actor: user_id }, req)
              return progress = 0
          }


  },
}