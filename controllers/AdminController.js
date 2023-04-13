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
        $sql = 'SELECT * FROM theatre';
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
            const fileImage = files.image[0];

            const theatre = await getTheatreById(id);

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
            if (errMove) {
                res.status(500).json({
                    code: 500,
                    message: errMove
                });
            }
            const sql = `UPDATE theatre SET name = ?, address = ?, image = ? WHERE id = ?`;
            const params = [name, address, destination + fileImage.originalFilename, id];
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
    if (fileImage.size > 1024 * 1024) {
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


module.exports = AdminControllers;