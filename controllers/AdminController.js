const db = require('../database');
const multiparty = require('multiparty')
const fs = require('fs');
const path = require('path');

const AdminControllers = {
    getAllUser: (req, res) => {
        $sql = 'SELECT * FROM user';
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
    getAllTheatres: (req, res) => {
        $sql = `
                SELECT t.id, t.name, t.address, t.image,
                COALESCE(SUM(CASE WHEN r.type = '2D/3D' THEN 1 ELSE 0 END), 0) AS 'R2D_3D',
                COALESCE(SUM(CASE WHEN r.type = '4DX' THEN 1 ELSE 0 END), 0) AS 'R4DX',
                COALESCE(SUM(CASE WHEN r.type = 'IMAX' THEN 1 ELSE 0 END), 0) AS 'RIMAX'
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
        $sql = `
                SELECT t.id AS theatre_id, t.name AS theatre_name, t.address AS theatre_address, t.image AS theatre_image,
                COALESCE(SUM(CASE WHEN r.type = '2D/3D' THEN 1 ELSE 0 END), 0) AS 'R2D_3D',
                COALESCE(SUM(CASE WHEN r.type = '4DX' THEN 1 ELSE 0 END), 0) AS 'R4DX',
                COALESCE(SUM(CASE WHEN r.type = 'IMAX' THEN 1 ELSE 0 END), 0) AS 'RIMAX'
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
            }

            const name = fields.name[0];
            const address = fields.address[0];
            const roomList = [fields.room2D_3D[0], fields.room4DX[0], fields.roomIMAX[0]];
            const roomListName = ['2D/3D', '4DX', 'IMAX'];
            const fileImage = files.image[0];

            // validate image
            const errImage = validateImage(fileImage);
            if (errImage) {
                res.status(500).json({
                    code: 500,
                    message: errImage
                });
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
            }
            const id = fields.id[0];
            const name = fields.name[0];
            const address = fields.address[0];

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
        const theatre = await getTheatreById(id);
        if (theatre === 0) {
            res.status(500).json({
                code: 500,
                message: 'Theatre not exist'
            });
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
    }
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

module.exports = AdminControllers;