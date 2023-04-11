const conn = require('../config/db');
const AdminControllers = {
    getAllUser: (req, res) => {
        $sql = 'SELECT * FROM user';
        conn.query($sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    )} 
}
module.exports = AdminControllers;