const db = require('../database');
const MovieControllers = {
    getAllMovie: (req, res) => {
        const status = req.query.status;
        const sql = `SELECT movie.name, movie.duration, movie.release_date, movie.image, movie.trailer, GROUP_CONCAT(category.name) AS categories
                    FROM movie
                    INNER JOIN movie_category ON movie.id = movie_category.movie_id
                    INNER JOIN category ON movie_category.category_id = category.id
                    WHERE movie.status = ?
                    GROUP BY movie.id`;
        db.queryParams(sql, [status])
            .then((results) => {
                res.json(results);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'Internal server error' });
            });
    },
    getMovieById: (req, res) => {
        const id = req.query.id;
        const sql = `SELECT movie.name, movie.duration, movie.release_date, movie.image, movie.trailer, GROUP_CONCAT(category.name) AS categories
                    FROM movie
                    INNER JOIN movie_category ON movie.id = movie_category.movie_id
                    INNER JOIN category ON movie_category.category_id = category.id
                    WHERE movie.id = ?
                    GROUP BY movie.id`;
        db.queryParams(sql, [id])
            .then((results) => {
                res.json(results);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'Internal server error' });
            });
    },
    getMovieByName: (req, res) => {
        let name = req.query.name;
        name = name.toLowerCase();
        const sql = `SELECT movie.name, movie.duration, movie.release_date, movie.image, movie.trailer, GROUP_CONCAT(category.name) AS categories
                    FROM movie
                    INNER JOIN movie_category ON movie.id = movie_category.movie_id
                    INNER JOIN category ON movie_category.category_id = category.id
                    WHERE LOWER(movie.name) LIKE ?
                    GROUP BY movie.id`;
        db.queryParams(sql, [`%${name}%`])
            .then((results) => {
                res.json(results);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'Internal server error' });
            });
    },
    getAllPoster: (req, res) => {
        const sql = `SELECT movie.id, movie.name, movie.image FROM movie`;
        db.query(sql)
            .then((results) => {
                res.json(results);
            }
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'Internal server error' });
            }
            );
    },

}
module.exports = MovieControllers;
