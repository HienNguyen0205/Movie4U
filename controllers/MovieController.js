const conn = require('../config/db');
const MovieControllers = {
    getAllMovie: (req, res) => {
        $sql = 'SELECT * FROM movie';
        conn.query($sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    },
    getAllCategory: (req, res) => {
        $sql = 'SELECT * FROM category';
        conn.query($sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    },
}
module.exports = MovieControllers;
