const express = require("express");
const axios = require("axios");
const registry = require("./registry.json");

const router = express.Router();
const asynHandler = require("../middleware/async");
// App SETUP

router.all(`/:apiName/:path/`,asynHandler(async (req, res) => {
    let apiName = req.params.apiName;
    let path = req.params.path;
    let userData = req.user;
    const service = registry.services[apiName];
    const url = service.instances[0].url;
    const apikey = service.instances[0].api_key;
    const apisecret = service.instances[0].api_secret;
    console.log('====================================');
    console.log(url + path + Object.values(req.params)[0]);
    console.log('====================================');
    axios({
      method: req.method,
      url: url + path,
      headers: { 
        'Content-Type':'application/json', 
        'User-Agent': req.headers['user-agent'],
        'app-key':apikey,
        'app-secret':apisecret,
        'actor-info':JSON.stringify(userData),
      },
      data: req.body,
    })
      .then((response) => {
        res.send(response.data);

      })
      .catch((error) => {
        console.log('====================================');
        console.log(error.response);
        console.log('====================================');
        res.send(error.response.data);
      });
  })
);
module.exports = router;
