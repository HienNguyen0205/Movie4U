const helper = {
    convertTime: function (time) {
        if (time.match(/^\d{2}:\d{2}$/)) {
            // Add seconds component ":00"
            return time + ':00';
        } else {
            return time;
        }

    },
    createOTPCode: function (account_id) {
        // code i 6 digits
        let code = Math.floor(100000 + Math.random() * 900000);
        const sql = `INSERT INTO otp_code (account_id, code) VALUES (?, ?)`;
        db.queryParams(sql, [account_id, code])
            .then((results) => {
                return code;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    },
    verifyOTPCode: function (account_id, code) {
        // time out is 2 minutes
        const sql = `SELECT * FROM otp_code WHERE account_id = ? AND code = ?`;
        db.queryParams(sql, [account_id, code])
            .then((results) => {
                if (results.length > 0) {
                    // check time out
                    let time = new Date();
                    let timeOut = new Date(results[0].created_at);
                    timeOut.setMinutes(timeOut.getMinutes() + 2);
                    if (time > timeOut) {
                        return false;
                    }
                    //delete otp code
                    const sql = `DELETE FROM otp_code WHERE account_id = ? AND code = ?`;
                    db.queryParams(sql, [account_id, code])
                        .then((results) => {
                            return true;
                        })
                        .catch((err) => {
                            console.log(err);
                            return false;
                        });
                } else {
                    return false;
                }
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
    },
}

module.exports = helper;