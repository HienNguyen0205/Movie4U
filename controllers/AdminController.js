const db = require('../database');
const multiparty = require('multiparty')
const fs = require('fs');
const path = require('path');
const helper = require('../helper');

const AdminControllers = {
    getAllUser: (req, res) => {
        $sql = 'SELECT * FROM account WHERE status = 1';
        db.query($sql)
            .then((results) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: results
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },

    deleteUser: (req, res) => {
        const id = req.query.id;
        if (!id) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }
        $sql = 'DELETE FROM account WHERE id = ?';
        db.queryParams($sql, [id])
            .then((results) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success'
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },

    getAllMovie(req, res) {
        const sql = `SELECT * FROM movie`;
        db.query(sql)
            .then((results) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: results
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },

    getAllTheatres: (req, res) => {
        const sql = `
                SELECT t.id, t.name, t.address, t.image,
                COALESCE(SUM(CASE WHEN r.type = '2D/3D' THEN 1 ELSE 0 END), 0) AS 'R2D_3D',
                COALESCE(SUM(CASE WHEN r.type = '4DX' THEN 1 ELSE 0 END), 0) AS 'R4DX',
                COALESCE(SUM(CASE WHEN r.type = 'IMAX' THEN 1 ELSE 0 END), 0) AS 'RIMAX',
                GROUP_CONCAT(r.id) AS room_id, GROUP_CONCAT(r.name) AS room_name, GROUP_CONCAT(r.type) AS room_type
                FROM theatre t
                LEFT JOIN room r ON t.id = r.theatre_id
                GROUP BY t.id, t.name;
                `;
        db.query(sql)
            .then((results) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: results
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },
    getTheatreById: (req, res) => {
        const theatre_id = req.query.theatre_id;

        if (!theatre_id) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }

        $sql = `
                SELECT t.id AS theatre_id, t.name AS theatre_name, t.address AS theatre_address, t.image AS theatre_image,
                COALESCE(SUM(CASE WHEN r.type = '2D/3D' THEN 1 ELSE 0 END), 0) AS 'R2D_3D',
                COALESCE(SUM(CASE WHEN r.type = '4DX' THEN 1 ELSE 0 END), 0) AS 'R4DX',
                COALESCE(SUM(CASE WHEN r.type = 'IMAX' THEN 1 ELSE 0 END), 0) AS 'RIMAX',
                GROUP_CONCAT(r.id) AS room_id, GROUP_CONCAT(r.name) AS room_name, GROUP_CONCAT(r.type) AS room_type
                FROM theatre t
                LEFT JOIN room r ON t.id = r.theatre_id
                WHERE t.id = ?
                GROUP BY t.id, t.name, t.address, t.image;
                `;
        db.queryParams($sql, [theatre_id])
            .then((results) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: results
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },
    addTheatre(req, res) {
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
                return;
            }

            const name = fields.name[0];
            const address = fields.address[0];
            const roomList = [fields.R2D_3D[0], fields.R4DX[0], fields.RIMAX[0]];
            const roomListName = ['2D/3D', '4DX', 'IMAX'];
            const fileImage = files.image[0];

            if (!name || !address || !roomList || !fileImage) {
                res.status(400).json({
                    code: 400,
                    message: 'Bad request'
                });
                return;
            }

            // validate image
            const errImage = validateImage(fileImage);
            if (errImage) {
                res.status(500).json({
                    code: 500,
                    message: errImage
                });
                return;
            }
            // move image to folder images/MovieTheatres
            const oldPath = fileImage.path;
            const destination = '/images/MovieTheatres/';
            const fileName = fileImage.originalFilename;
            const errMove = moveFile(oldPath, fileName, destination);
            if (errMove) {
                res.status(500).json({
                    code: 500,
                    message: errMove
                });
                return;
            }
            const sql = `INSERT INTO theatre(name, address, image) VALUES(?, ?, ?)`;
            const params = [name, address, destination + fileImage.originalFilename];
            db.queryTransaction(sql, params)
                .then(async (result) => {
                    const theatreId = result.insertId;
                    await addRoom(theatreId, roomList, roomListName)
                    res.status(200).json({
                        code: 200,
                        message: 'Success',
                        data: result
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        code: 500,
                        message: 'Internal server error'
                    });
                });
        });
    },

    updateTheatre(req, res) {
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
                return;
            }
            const id = fields.id[0];
            const name = fields.name[0];
            const address = fields.address[0];

            if (!id || !name || !address) {
                res.status(400).json({
                    code: 400,
                    message: 'Bad request'
                });
                return;
            }

            const theatre = await getTheatreById(id);

            if (theatre?.length === 0 || theatre === null) {
                res.status(202).json({
                    code: 202,
                    message: 'No Theatre found'
                });
                return;
            }

            let params = [];
            params = [name, address, theatre[0].image, id];
            const sql = `UPDATE theatre SET name = ?, address = ?, image = ? WHERE id = ?`;

            if (files.image !== undefined) {
                const fileImage = files.image[0];

                await removeFile(theatre[0].image, 'theatre');

                // validata image
                const errImage = validateImage(fileImage);
                if (errImage) {
                    res.status(500).json({
                        code: 500,
                        message: errImage
                    });
                    return;
                }
                // move image to folder images/MovieTheatres
                const oldPath = fileImage.path;
                const destination = '/images/MovieTheatres/';
                const fileName = fileImage.originalFilename;
                const errMove = moveFile(oldPath, fileName, destination);
                params = [name, address, destination + fileImage.originalFilename, id];

                if (errMove) {
                    res.status(500).json({
                        code: 500,
                        message: errMove
                    });
                    return;
                }
            }

            db.queryTransaction(sql, params)
                .then((result) => {
                    res.status(200).json({
                        code: 200,
                        message: 'Success',
                        data: result
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        code: 500,
                        message: 'Internal server error'
                    });
                });
        });
    },
    async deleteTheatre(req, res) {
        const id = req.query.id;

        if (!id) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }

        const theatre = await getTheatreById(id);

        console.log(theatre);

        if (theatre === null || theatre?.length === 0) {
            res.status(500).json({
                code: 500,
                message: 'Theatre not exist'
            });
            return;
        }

        removeFile(theatre[0].image, 'theatre');

        const sql = `DELETE FROM theatre WHERE id = ?`;
        const params = [id];
        await db.queryTransaction(sql, params)
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: result
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },
    getRevenue(req, res) {
        $sql = `SELECT SUM(total) as total FROM ticket`;
        let revenue = 0;
        db.query($sql)
            .then((result) => {
                revenue = result[0].total;
            });
        $sql = `SELECT COUNT(*) as total FROM ticket`;
        let totalTicket = 0;
        db.query($sql)
            .then((result) => {
                totalTicket = result[0].total;
            }
            );
        let toltalView = 0;
        $sql = `SELECT COUNT(*) as total FROM seat`;
        db.query($sql)
            .then((result) => {
                toltalView = result[0].total;
            });

        res.status(200).json({
            code: 200,
            message: 'Success',
            data: {
                revenue: revenue,
                totalTicket: totalTicket,
                toltalView: toltalView
            }
        });
    },
    addScheduleMovie: async (req, res) => {
        let { movie_id, theatre_id, room_id, date, start_time, end_time, price } = req.body;
        if (!movie_id || !theatre_id || !room_id || !date || !start_time || !end_time || !price) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }

        start_time = helper.convertTime(start_time);
        end_time = helper.convertTime(end_time);

        let checkSchedule = await checkScheduleTime(start_time, end_time, date, room_id);

        if (checkSchedule !== null) {
            res.status(500).json({
                code: 500,
                message: 'Time is not available'
            });
            return;
        }

        // schedule time store start and end time as start_time and end_time and also link to schedule table so need to insert to schedule table first
        // schedule table has movie_id, theatre_id, room_id, date

        checkSchedule = await checkScheduleExist(movie_id, theatre_id, room_id, date);

        if (checkSchedule !== null) {
            const schedule_id = checkSchedule[0].id;
            const sql = `INSERT INTO schedule_time (schedule_id, start_time, end_time) VALUES (?, ?, ?)`;
            const params = [schedule_id, start_time, end_time];
            await db.queryTransaction(sql, params)
                .then((result) => {
                    res.status(200).json({
                        code: 200,
                        message: 'Add schedule successfully',
                        data: result
                    });
                    return;
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        code: 500,
                        message: 'Internal server error'
                    });
                    return;
                });
        } else {
            const sql = `INSERT INTO schedule (movie_id, theatre_id, room_id, date, price) VALUES (?, ?, ?, ?, ?)`;
            const params = [movie_id, theatre_id, room_id, date, price];

            db.queryTransaction(sql, params)
                .then(async (result) => {
                    const schedule_id = result.insertId;
                    const sql = `INSERT INTO schedule_time (schedule_id, start_time, end_time) VALUES (?, ?, ?)`;
                    const params = [schedule_id, start_time, end_time];
                    await db.queryTransaction(sql, params)
                        .then((result) => {
                            res.status(200).json({
                                code: 200,
                                message: 'Add schedule successfully',
                                data: result
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                code: 500,
                                message: 'Internal server error'
                            });
                        });
                })
        }

    },

    getAllSchedule: async (req, res) => {
        const sql = `SELECT
        sch.id AS schedule_id,
        sch.movie_id,
        m.name AS movie_name,
        sch.room_id,
        sch.theatre_id,
        CONVERT_TZ(sch.date, '-07:00', '+07:00') as date,
        sch.price,
        GROUP_CONCAT(DISTINCT st.start_time) AS start_times,
        GROUP_CONCAT(DISTINCT st.end_time) AS end_times,
        GROUP_CONCAT(DISTINCT st.id) AS schedule_time_ids,
        th.name AS theatre_name,
        th.address AS theatre_address,
        th.image AS theatre_image,
        r.name AS room_name,
        r.type AS room_type,
        r.capacity AS room_capacity
        FROM 
            schedule sch
        LEFT JOIN 
            theatre th ON sch.theatre_id = th.id
        LEFT JOIN 
            room r ON sch.room_id = r.id
        LEFT JOIN 
            schedule_time st ON sch.id = st.schedule_id
        JOIN 
            movie m ON sch.movie_id = m.id
        GROUP BY sch.id, th.name, th.address, th.image, r.name, r.type, r.capacity;
     
        `;
        db.query(sql)
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: result
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },

    getFoodComboById: async (req, res) => {
        const id = req.query.id;
        const sql = `SELECT * FROM food_combo WHERE id = ?`;
        const params = [id];
        db.queryParams(sql, params)
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: result
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },

    addFoodCombo: async (req, res) => {
        //form
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
                return;
            }

            const name = fields.name[0];
            const price = fields.price[0];
            const description = fields.description[0];
            const popcorn = fields.popcorn[0];
            const drink = fields.drink[0];
            const imageFile = files.image[0];

            if (!name || !price || !description || !imageFile || !popcorn || !drink) {
                res.status(400).json({
                    code: 400,
                    message: 'Bad request'
                });
                return;
            }

            const check = await validateImage(imageFile);
            if (check !== null) {
                res.status(400).json({
                    code: 400,
                    message: check
                });
                return;
            }

            const fileName = imageFile.originalFilename;
            const filePath = `/images/FoodCombo/${fileName}`;
            const oldPath = imageFile.path;

            moveFile(oldPath, fileName, 'images/FoodCombo');

            const sql = `INSERT INTO food_combo (name, price, description, image, popcorn, drink) VALUES (?, ?, ?, ?, ?, ?)`;
            const params = [name, price, description, filePath, popcorn, drink];

            db.queryTransaction(sql, params)
                .then((result) => {
                    res.status(200).json({
                        code: 200,
                        message: 'Add food combo successfully',
                        data: result
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        code: 500,
                        message: 'Internal server error'
                    });
                });
        });
    },

    updateFoodCombo: async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
                return;
            }

            const id = fields.id[0];
            const name = fields.name[0];
            const price = fields.price[0];
            const description = fields.description[0];
            const popcorn = fields.popcorn[0];
            const drink = fields.drink[0];


            if (!id || !name || !price || !description || !popcorn || !drink) {
                res.status(400).json({
                    code: 400,
                    message: 'Bad request'
                });
                return;
            }

            const food_combo = await getFoodComboById(id);

            if (food_combo.length === 0) {
                res.status(404).json({
                    code: 404,
                    message: 'Food combo not found'
                });
                return;
            }
            let params = [name, price, description, food_combo[0].image, popcorn, drink, id];
            const sql = `UPDATE food_combo SET name = ?, price = ?, description = ?, image = ?, popcorn = ?, drink = ? WHERE id = ?`;
            if (files.image[0] !== undefined) {
                const imageFile = files.image[0];
                const check = await validateImage(imageFile);
                if (check !== null) {
                    res.status(400).json({
                        code: 400,
                        message: check
                    });
                    return;
                }
                const fileName = `${imageFile.originalFilename}`;
                const filePath = `/images/FoodCombo/${fileName}`;
                const oldPath = imageFile.path;
                moveFile(oldPath, fileName, 'images/FoodCombo');
                removeFile(food_combo[0].image, 'food_combo');
                params = [name, price, description, filePath, popcorn, drink, id];
                db.queryParams(sql, params)
                    .then((result) => {
                        res.status(200).json({
                            code: 200,
                            message: 'Update food combo successfully',
                            data: result
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            code: 500,
                            message: 'Internal server error'
                        });
                    });
            } else {
                db.queryParams(sql, params)
                    .then((result) => {
                        res.status(200).json({
                            code: 200,
                            message: 'Update food combo successfully',
                            data: result
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            code: 500,
                            message: 'Internal server error'
                        });
                    });
            }
        });
    },

    deleteFoodCombo: async (req, res) => {
        const id = req.query.id;

        if (!id) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }

        const food_combo = await getFoodComboById(id);

        if (food_combo?.length === 0 || food_combo === null) {
            res.status(404).json({
                code: 404,
                message: 'Food combo not found'
            });
            return;
        }

        const sql = `DELETE FROM food_combo WHERE id = ?`;
        const params = [id];

        db.queryTransaction(sql, params)
            .then((result) => {
                removeFile(food_combo[0].image, 'food_combo');
                res.status(200).json({
                    code: 200,
                    message: 'Delete food combo successfully',
                    data: result
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },

    addMovie: async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
                return;
            }

            const name = fields.name[0];
            const description = fields.description[0];
            const duration = fields.duration[0];
            const releaseDate = fields.releaseDate[0];
            const director = fields.director[0];
            const actors = fields.actors[0];
            const trailer = fields.trailer[0];
            const imageFile = files.image[0];
            const status = fields.status[0];
            const category_id = fields.category_id[0];

            if (!name || !description || !duration || !releaseDate || !director || !actors || !trailer || !imageFile || !status || !category_id) {
                res.status(400).json({
                    code: 400,
                    message: 'Bad request'
                });
                return;
            }

            const categoryList = category_id.split(',');

            const check = await validateImage(imageFile);
            if (check !== null) {
                res.status(400).json({
                    code: 400,
                    message: check
                });
                return;
            }
            const fileName = `${imageFile.originalFilename}`;
            const filePath = `/images/Movie/${fileName}`;
            const oldPath = imageFile.path;
            moveFile(oldPath, fileName, 'images/Movie');

            const sql = `INSERT INTO movie (name, description, duration, release_date, director, actors, trailer, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const params = [name, description, duration, releaseDate, director, actors, trailer, filePath, status];

            db.queryTransaction(sql, params)
                .then(async (result) => {
                    const insertId = result.insertId;
                    await addCategoryForMovie(insertId, categoryList);
                    res.status(200).json({
                        code: 200,
                        message: 'Add movie successfully',
                        data: result
                    });

                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        code: 500,
                        message: 'Internal server error'
                    });
                });
        });
    },

    updateMovie: async (req, res) => {
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
                return;
            }

            const id = fields.id[0];
            const name = fields.name[0];
            const description = fields.description[0];
            const duration = fields.duration[0];
            const releaseDate = fields.releaseDate[0];
            const director = fields.director[0];
            const actors = fields.actors[0];
            const trailer = fields.trailer[0];
            const status = fields.status[0];
            const category_id = fields.category_id[0];

            if (!id || !name || !description || !duration || !releaseDate || !director || !actors || !trailer || !status || !category_id) {
                res.status(400).json({
                    code: 400,
                    message: 'Bad request'
                });
                return;
            }

            const categoryList = category_id.split(',');

            const movie = await getMovieById(id);

            if (movie?.length === 0 || movie === null) {
                res.status(404).json({
                    code: 404,
                    message: 'Movie not found'
                });
                return;
            }

            if (files.image[0] !== undefined) {
                const imageFile = files.image[0];
                const check = await validateImage(imageFile);
                if (check !== null) {
                    res.status(400).json({
                        code: 400,
                        message: check
                    });
                    return;
                }
                const fileName = `${imageFile.originalFilename}`;
                const filePath = `/images/Movie/${fileName}`;
                const oldPath = imageFile.path;
                moveFile(oldPath, fileName, 'images/Movie');
                removeFile(movie[0].image, 'movie');
                params = [name, description, duration, releaseDate, director, actors, trailer, filePath, status, id];
                db.queryParams(sql, params)
                    .then(async (result) => {
                        await updateMovieToCinema(id, categoryList);
                        res.status(200).json({
                            code: 200,
                            message: 'Update movie successfully',
                            data: result
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            code: 500,
                            message: 'Internal server error'
                        });
                    });
            } else {
                params = [name, description, duration, releaseDate, director, actors, trailer, status, id];
                db.queryParams(sql, params)
                    .then(async (result) => {
                        await updateMovieToCinema(id, categoryList);
                        res.status(200).json({
                            code: 200,
                            message: 'Update movie successfully',
                            data: result
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            code: 500,
                            message: 'Internal server error'
                        });
                    });
            }
        });
    },

    deleteMovie: async (req, res) => {
        const id = req.query.id;
        if (!id) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }

        const movie = await getMovieById(id);
        if (movie?.length === 0 || movie === null) {
            res.status(404).json({
                code: 404,
                message: 'Movie not found'
            });
            return;
        }

        const sql = `DELETE FROM movie WHERE id = ?`;
        const params = [id];
        db.queryParams(sql, params)
            .then((result) => {
                removeFile(movie[0].image, 'movie');
                res.status(200).json({
                    code: 200,
                    message: 'Delete movie successfully',
                    data: result
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },

}

function moveFile(oldPath, fileName, destination) {
    const newPath = path.join(__dirname, `/../public` + `/${destination}/${fileName}`);
    fs.copyFileSync(oldPath, newPath)
    return null;
}

function removeFile(filePath, table = "") {
    const oldPath = path.join(__dirname, `/../public` + `${filePath}`);

    if (table !== "") {
        const sql = `SELECT * FROM ${table} WHERE image = ?`;
        const params = [filePath];
        db.queryParams(sql, params)
            .then((result) => {
                if (result.length > 1) {
                    fs.unlinkSync(oldPath);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        return null;
    }
}

function validateImage(fileImage) {
    if (fileImage.size > 5000000) {
        return 'Image is too large';
    }
    let regex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i
    if (!regex.test(fileImage.originalFilename)) {
        return 'Image is not valid';
    }
    return null;
}

async function getTheatreById(id) {
    const sql = `SELECT * FROM theatre WHERE id = ?`;
    const params = [id];
    const result = await db.queryParams(sql, params);
    if (result.length === 0) {
        return null;
    }
    return result;
}

async function addRoom(theatre_id, roomList, roomListName) {
    let insertQueries = [];
    let count = 0;
    for (let i = 0; i < roomList.length; i++) {
        for (let j = 0; j < roomList[i]; j++) {
            insertQueries.push({
                sql: 'INSERT INTO room (theatre_id,type, name) VALUES (?,?,?)',
                values: [theatre_id, roomListName[i], `Room ${count}`]
            });
            count++;
        }
    }

    insertQueries.forEach((query) => {
        db.queryTransaction(query.sql, query.values);
    });
}

async function checkScheduleTime(start_time, end_time, date, room_id) {
    // schedulue"_time store start_time and end_time and have a foreign key shedule_id have date and room_id, check it to make sure that during the start to end time have no schedule is not exist
    const sql = `
    SELECT *
    FROM schedule_time
    WHERE (
        (start_time <= ? AND end_time >= ?) OR
        (start_time < ? + INTERVAL 1 HOUR AND end_time > ? + INTERVAL 1 HOUR) OR
        (start_time < ? - INTERVAL 1 HOUR AND end_time > ? - INTERVAL 1 HOUR) OR
        (start_time < ? AND end_time > ?)
    )
    AND schedule_id IN (SELECT id FROM schedule WHERE date = ? AND room_id = ?)
    `;

    const params = [start_time, end_time, start_time, end_time, start_time, end_time, start_time, start_time, date, room_id];

    const result = await db.queryParams(sql, params);

    if (result.length > 0) {
        return result;
    }

    return null;
}

async function checkScheduleExist(movie_id, theatre_id, room_id, date) {
    const sql = `SELECT * FROM schedule WHERE movie_id = ? AND theatre_id = ? AND room_id = ? AND date = ?`;
    const params = [movie_id, theatre_id, room_id, date];
    const result = await db.queryParams(sql, params);
    if (result.length > 0) {
        return result;
    }
    return null;
}

async function getFoodComboById(id) {
    const sql = `SELECT * FROM food_combo WHERE id = ?`;
    const params = [id];
    const result = await db.queryParams(sql, params);
    if (result.length === 0) {
        return null;
    }
    return result;
}

async function addCategoryForMovie(movie_id, categoryList) {
    let insertQueries = [];
    for (let i = 0; i < categoryList.length; i++) {
        insertQueries.push({
            sql: 'INSERT INTO movie_category (movie_id, category_id) VALUES (?,?)',
            values: [movie_id, categoryList[i]]
        });
    }

    insertQueries.forEach((query) => {
        db.queryTransaction(query.sql, query.values);
    });
}

async function updateCategoryForMovie(id) {

}
module.exports = AdminControllers;