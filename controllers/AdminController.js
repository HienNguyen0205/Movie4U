const db = require('../database');
const multiparty = require('multiparty')
const fs = require('fs');
const path = require('path');

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
        if(!id) {
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

    getAllTheatres: (req, res) => {
        $sql = `
                SELECT t.id, t.name, t.address, t.image,
                COALESCE(SUM(CASE WHEN r.type = '2D/3D' THEN 1 ELSE 0 END), 0) AS 'R2D_3D',
                COALESCE(SUM(CASE WHEN r.type = '4DX' THEN 1 ELSE 0 END), 0) AS 'R4DX',
                COALESCE(SUM(CASE WHEN r.type = 'IMAX' THEN 1 ELSE 0 END), 0) AS 'RIMAX',
                GROUP_CONCAT(r.id) AS room_id, GROUP_CONCAT(r.name) AS room_name, GROUP_CONCAT(r.type) AS room_type
                FROM theatre t
                LEFT JOIN room r ON t.id = r.theatre_id
                GROUP BY t.id, t.name;
                `;
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
    getTheatreById: (req, res) => {
        const theatre_id = req.query.theatre_id;

        if(!theatre_id) {
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

            if(!name || !address || !roomList || !fileImage) {
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

            if(!id || !name || !address) {
                res.status(400).json({
                    code: 400,
                    message: 'Bad request'
                });
                return;
            }

            const theatre = await getTheatreById(id);

            let params = [];
            params = [name, address, theatre[0].image, id];
            const sql = `UPDATE theatre SET name = ?, address = ?, image = ? WHERE id = ?`;
            
            if(files.image !== undefined) {
                const fileImage = files.image[0];
                if (theatre !== null) {
                    removeFile(theatre[0].image);
                }
    
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
        if (theatre === 0) {
            res.status(500).json({
                code: 500,
                message: 'Theatre not exist'
            });
            return;
        }

        removeFile(theatre[0].image);

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
        const { movie_id, theatre_id, room_id, date, start_time, end_time, price } = req.body;
        if (!movie_id || !theatre_id || !room_id || !date || !start_time || !end_time || !price) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }

        const checkSchedule = await checkScheduleTime(date, start_time, end_time, room_id);

        console.log(checkSchedule);

        if (checkSchedule === null) {
            res.status(500).json({
                code: 500,
                message: 'Time is not available'
            });
            return;
        }

        // schedule time store start and end time as start_time and end_time and also link to schedule table so need to insert to schedule table first
        // schedule table has movie_id, theatre_id, room_id, date
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
    },

    getAllSchedule: async (req, res) => {
        const sql = `SELECT
        sch.id AS schedule_id,
        sch.movie_id,
        sch.room_id,
        sch.theatre_id,
        sch.date,
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
        JOIN 
            theatre th ON sch.theatre_id = th.id
        JOIN 
            room r ON sch.room_id = r.id
        JOIN 
            schedule_time st ON sch.id = st.schedule_id
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

}

function moveFile(oldPath, fileName, destination) {
    const newPath = path.join(__dirname, `/../public` + `/${destination}/${fileName}`);
    fs.copyFileSync(oldPath, newPath)
    return null;
}

function removeFile(filePath) {
    const oldPath = path.join(__dirname, `/../public` + `${filePath}`);
    console.log(oldPath);
    if (!fs.existsSync(oldPath)) {
        console.log('File not exist');
        return null;
    }
    fs.unlinkSync(oldPath);
    console.log('File deleted');
    return null;
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
        (start_time <= ? + INTERVAL 1 HOUR AND end_time >= ? + INTERVAL 1 HOUR) OR
        (start_time <= ? - INTERVAL 1 HOUR AND end_time >= ? - INTERVAL 1 HOUR)
    )
    AND schedule_id IN (SELECT id FROM schedule WHERE date = ? AND room_id = ?)
    `;
    
    const params = [start_time, end_time, start_time, end_time, start_time, end_time, date, room_id];
    const result = await db.queryParams(sql, params);
    
    if (result.length > 0) {
        return result;
    }
    
    return null;
}

module.exports = AdminControllers;