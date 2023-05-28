const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const asynHandler = require("./async");
const { sendResponse, CatchHistory } = require("../helper/utilfunc");
const { DetectDevice, DetectIp, MainDec } = require("../helper/devicefuncs");
dotenv.config({ path: "./config/config.env" });
const systemDate = new Date().toISOString().slice(0, 19).replace("T", " ");
exports.appauth = asynHandler(async (req, res, next) => {
  let key = req.headers['app-key'];
  let secret = req.headers['app-secret']
  //search for app in db
  const foundApp = await AppAuthModel.auth(key)


  let AppDbInfo = foundApp.rows[0]
  console.log(AppDbInfo);
  if (!AppDbInfo) {
    // CatchHistory({ pi_response: "Unauthorized access-app not in database", function_name: 'appauth', date_started: systemDate, sql_action: "SELECT", event: "App Authentication", actor: '' }, req)
    return sendResponse(res, 0, 500, 'Unauthorized access to api')

  }
  //is app active ?
  if (!AppDbInfo.app_status) {
    // CatchHistory({ api_response: "Unauthorized access-app exist but not active", function_name: 'appauth', date_started: systemDate, sql_action: "SELECT", event: "App Authentication", actor: '' }, req)
    return sendResponse(res, 0, 500, 'Unauthorized access to api')
  }


  //check for secret
  const match = await bcrypt.compare(secret, AppDbInfo.app_secret)

  if (!match) {
    // CatchHistory({ api_response: "Unauthorized access-app exist but secret does not match", function_name: 'appauth', date_started: systemDate, sql_action: "SELECT", event: "App Authentication", actor: '' }, req)
    return sendResponse(res, 0, 401, 'Unauthorized access to api')
  }


  if (!AppDbInfo.check_ip) {
    req.RequestingAppInfo = AppDbInfo
    return next()
  }

  //check if ip exist
  var arrayOfallowedIps = !AppDbInfo?.allowed_ips ? "" : AppDbInfo?.allowed_ips.split(",");
  var found = arrayOfallowedIps.includes(String('154.160.4.142'));

  if (AppDbInfo.check_ip && !found) {
    // CatchHistory({ api_response: "Unauthorized access-app exist but ip not in db", function_name: 'appauth', date_started: systemDate, sql_action: "SELECT", event: "App Authentication", actor: '' }, req)
    return sendResponse(res, 0, 401, 'Unauthorized access to api')
  }
  if (AppDbInfo.check_ip && found) {
    req.RequestingAppInfo = AppDbInfo
    return next()
  }

});
exports.protect = asynHandler(async (req, res, next) => {
  let device = await DetectDevice(req.headers['user-agent'], req)
  let userIp = DetectIp(req)
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req?.cookies?.jwt) {
    token = req?.cookies?.jwt;
  }


  console.log(req.headers.cookie);
  //make sure token exists
  if (!token) {
    console.log('no token');
    CatchHistory({ api_response: `User login failed: no token present`, function_name: 'protect-middleware', date_started: systemDate, sql_action: "", event: "Middleware to protect routes", actor: '' }, req)
    return sendResponse(res, 0, 401, 'Sorry Login not successful')
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let tokenInfo = decoded.EncUserInfo
    let decryptToken = MainDec(tokenInfo)

    let checkIp = decryptToken?.devirb
    let checkDevice = decryptToken?.devcrb
    if (checkIp === userIp && checkDevice === device) {
      req.user = decryptToken;
      return next()
    } else {
      console.log('DeviceCheck =', checkDevice === device);
      console.log('IPCheck =', checkIp === userIp);
      console.log('User want to bypass, but access denied');
      CatchHistory({ api_response: `User login failed: device or ip mismatch`, function_name: 'protect-middleware', date_started: systemDate, sql_action: "", event: "Middleware to protect routes", actor: '' }, req)
      return sendResponse(res, 0, 401, 'Sorry Login not successful')


    }

  } catch (error) {
    CatchHistory({ api_response: `User login failed: invalid token or token has expired`, function_name: 'protect-middleware', date_started: systemDate, sql_action: "", event: "Middleware to protect routes", actor: '' }, req)
    return sendResponse(res, 0, 401, 'Sorry Login not successful')
  }

});