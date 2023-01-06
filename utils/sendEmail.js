const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path = require('path');
const ExpressError = require('./ExpressError');

// const template = require('./template/mailTemplate');

const genEmail = async (token, user) => {
    return await ejs.renderFile(path.join(__dirname, '/template/resetPWD.ejs'), {token, user});
}

module.exports.sendEmail = async (token, user, next) => {
    const mailContent = await genEmail(token, user);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.EMAIL_PWD,
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to: user.email,
        subject: `This is a comfirmation email, ${user.username}`,
        html: mailContent
    }

    await transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            next(err);
        }
        else {
            return info;
        }
    })
}

