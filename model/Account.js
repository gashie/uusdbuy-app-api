const pool = require("../config/db");
const { logger } = require("../logs/winston");

let bluespaceddb = {};

bluespaceddb.auth = (email) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM user_profile WHERE email = $1", [email], (err, results) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }

            return resolve(results);
        });
    });
};

module.exports = bluespaceddb