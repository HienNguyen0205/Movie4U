const db = require('../database');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config('../.env');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
let refreshTokens = [];

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

        //check Email 
        const checkEmail = await checkEmail(user.email);
        if (checkEmail) {
            res.status(500).json({
                code: 500,
                message: 'Email already exists'
            });
            return;
        }
        // hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(user.password, salt);

        const sql = `INSERT INTO account (email, password, name, phone, address, role_id) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [user.email, hashPassword, user.name, user.phone, user.address, 1];

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
        if(!user) {
            res.status(500).json({
                code: 500,
                message: 'Email/Password is not correct'
            });
            return;
        }
        console.log(user);
        // check password
        const checkPassword = bcrypt.compareSync(password, user[0].password);
        if(!checkPassword) {
            res.status(500).json({
                code: 500,
                message: 'Email/Password is not correct'
            });
            return;
        }

        const accessToken = UserController.generateJWT(user[0].email, user[0].status);
        const refreshToken = UserController.generateRefreshJWT(user[0].email, user[0].status);
        refreshTokens.push(refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });
        // save user to session
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: user[0],
            accessToken: accessToken
        });
    },

    logout: (req, res) => {
        req.session.destroy();
        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });
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
            return;
        }

        const subject = 'Reset password';
        const content = 'Click here to reset password';

        sendMail(subject, content);
        res.status(200).json({
            code: 200,
            message: 'Success'
        });
    },

    generateJWT: (email, status) => {
        const payload = {
            email,
            status
        };
        const options = {
            expiresIn: process.env.JWT_EXPIRE 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        return token;
    },

    generateRefreshJWT: (email, status) => {
        const payload = {
            email,
            status
        };
        const options = {
            expiresIn: process.env.JWT_REFRESH_EXPIRE
        }

        const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, options);
        return token;
    },

};



async function checkEmail(email){
    const sql = `SELECT * FROM account WHERE email = ?`;
    const result = await db.queryParams(sql, [email]);
    if (result.length > 0) {
        return result;
    }
    return null;
}


module.exports = UserController;