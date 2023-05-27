const { sendResponse } = require("../helper/utilfunc");
const { logger } = require("../logs/winston");
const {usersignup} = require("../validation/schema");
module.exports = {
    userSetup: async (req, res, next) => {
    const options = {
      errors: {
        wrap: {
          label: "",
        },
      },
    };
    const value =  usersignup.validate(req.body, options);
    if (value.error) {
        sendResponse(res, 0, 200, value.error.details[0].message)
      logger.error(value.error.details[0].message);
    } else {
      next();
    }
  },

};
