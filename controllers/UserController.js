const db = require('../database');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config('../.env');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const MailService = require('../services/MailService');
let refreshTokens = [];



const UserController = {
    
    register: async (req, res) => {
        const user = req.body;

        if(!user.email || !user.password || !user.name) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }

        const isEmailExist = await checkEmail(user.email);
        //check Email 
        if (isEmailExist !== null) {
            res.status(500).json({
                code: 500,
                message: 'Email already exists'
            });
            return;
        }
        // hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(user.password, salt);

        const sql = `INSERT INTO account (email, password, name, status) VALUES (?, ?, ?, ?)`;
        const params = [user.email, hashPassword, user.name, 1];

        db.queryParams(sql, params)
            .then(async (result) => {
                // send email
                const content = `<h1>Welcome to Movie4U</h1><h2>Your account</h2><h3>Email: ${user.email}</h3><h3>Password: ${user.password}</h3>`;
                await MailService.sendMail(user.email, 'Welcome to Movie4U', content);
                res.status(200).json({
                    code: 200,
                    message: 'User registered successfully',
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

        const accessToken = UserController.generateJWT(user[0].id, user[0].email, user[0].status);
        const refreshToken = UserController.generateRefreshJWT(user[0].id, user[0].email, user[0].status);
        refreshTokens.push(refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });
        res.status(200).json({
            code: 200,
            message: 'User logged in successfully',
            data: user[0],
            accessToken: accessToken,
            status: user[0].status
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

    generateJWT: (id, email, status) => {
        const payload = {
            id,
            email,
            status
        };
        const options = {
            expiresIn: process.env.JWT_EXPIRE 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        return token;
    },

    generateRefreshJWT: (id, email, status) => {
        const payload = {
            id,
            email,
            status
        };
        const options = {
            expiresIn: process.env.JWT_REFRESH_EXPIRE
        }

        const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, options);
        return token;
    },

    getUserInfo: async (req, res) => {
        const user = req.user;
        const sql = `SELECT * FROM account WHERE id = ?`;
        const params = [user.id];
        db.queryParams(sql, params)
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: result[0]
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

    updateUserInfo: async (req, res) => {
        const user = req.user;
        const updateInfo = req.body;
        const sql = `UPDATE account SET name = ?, phone = ?, birthday = ?, address = ? WHERE id = ?`;
        const params = [updateInfo.name, updateInfo.phone, updateInfo.birthday, updateInfo.address, user.id];
        
        if(!updateInfo.name || !updateInfo.phone || !updateInfo.birthday || !updateInfo.address) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }

        if(!checkEmail(user.email)) {
            res.status(500).json({
                code: 201,
                message: 'Email already exists'
            });
            return;
        }


        db.queryParams(sql, params)
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    message: 'Update account successfully',
                    data: result[0]
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

    changePassword: async (req, res) => {
        const user = req.user;
        const password = req.body.password;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        if(!password || !newPassword || !confirmPassword) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
            return;
        }

        if(newPassword !== confirmPassword) {
            res.status(400).json({
                code: 400,
                message: 'New password and confirm password are not the same'
            });
            return;
        }

        const check = await checkPassword(user.id, password);
        if(!check) {
            res.status(500).json({
                code: 500,
                message: 'Password is not correct'
            });
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, salt);

        const sql = `UPDATE account SET password = ? WHERE id = ?`;
        const params = [hashPassword, user.id];

        db.queryParams(sql, params)
            .then((result) => {
                res.status(200).json({
                    code: 200,
                    message: 'Change password successfully',
                    data: result[0]
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

        
};

async function checkEmail(email) {
    const sql = `SELECT * FROM account WHERE email = ?`;
    const params = [email];
    const result = await db.queryParams(sql, params);
    console.log(result.length);
    if(result.length == 0) {
        return null;
    }
    return result;
}

async function checkPassword(id, password) { 
    const sql = `SELECT * FROM account WHERE id = ?`;
    const params = [id];
    const result = await db.queryParams(sql, params);
    
    if(result.length == 0) {
        return null;
    }

    const checkPassword = bcrypt.compareSync(password, result[0].password);
    return checkPassword;
}

module.exports = UserController;