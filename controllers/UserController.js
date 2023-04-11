const db = require('../database');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config('../.env');
const nodeMailer = require('nodemailer');

async function checkEmail(email) {
    const sql = `SELECT * FROM account WHERE email = ?`;
    const result = await db.queryParams(sql, [email]);
    if (result.length > 0) {
        return result;
    }
    return null;
}
const UserController = {
    register: async (req, res) => {
        const user = req.body;
        const sql = `INSERT INTO account (email, password, name, phone, address, role_id) VALUES (?, ?, ?, ?, ?, ?)`;
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(user.password, salt);
        const params = [user.email, hashPassword, user.name, user.phone, user.address, 2];
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
    login: async (req, res) => {
        // get data from a form request
        const email = req.body.email;
        const password = req.body.password;
        // check if email exists
        const user = await checkEmail(email);
        if(!checkEmail(email)) {
            res.status(500).json({
                code: 500,
                message: 'Email not found'
            });
        }
        // check if password is correct
        const sql = `SELECT * FROM account WHERE email = ?`;
    },
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },

    sendMail: async (req, res) => {
        const email = req.body.email;
        const user = await checkEmail(email);
        if(!user) {
            res.status(500).json({
                code: 500,
                message: 'Email not found'
            });
        }
        const subject = 'Reset password';
        const content = 'Click here to reset password';
        sendMail(subject, content);
        res.status(200).json({
            code: 200,
            message: 'Success'
        });
    }
};



async function validate()


module.exports = {
    UserController
}