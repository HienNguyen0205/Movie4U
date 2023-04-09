const db = require('../database');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config('../.env');
const nodeMailer = require('nodemailer');

async function register(user) {
    const sql = `INSERT INTO account (email, password, name, phone, address, role_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    const params = [user.email, hashPassword, user.name, user.phone, user.address, 2];
    const result = await db.queryParams(sql, params);
    return result;
}

async function login(req,res) {
    // get data from a form request
    const email = req.body.email;
    const password = req.body.password;
    // check if email exists
    const user = await checkEmail(email);
    if(!user) {
        res.render('login', {message: 'Email is incorrect'})
        return;
    }
    // get user info from database
    const sql = `SELECT * FROM account WHERE email = ?`;
    const result = await db.queryParams(sql, [email]);
    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) {
        res.render('login', {message: 'Password is incorrect'})
        return;
    }
    // create session
    req.session.user = user;
    // redirect to home page
    res.redirect('/');
}

async function sendMail(subject, content) {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASS
        },
        tls:{
            rejectUnauthorized: false,
        }
    })

    let mailOptions = {
        from: process.env.EMAIL_NAME,
        to: receiverMail,
        subject: subject,
        text: content
    }

    transporter.sendMail(mailOptions, (err) => {
        if(err) console.log('send email failed: ', err)
        else
            console.log('email sent')
    })
}

async function checkEmail(email) {
    const sql = `SELECT * FROM account WHERE email = ?`;
    const result = await db.queryParams(sql, [email]);
    if (result.length > 0) {
        return result;
    }
    return null;
}

async function validate()


module.exports = {
    register, login, sendMail
}