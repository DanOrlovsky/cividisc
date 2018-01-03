const nodemailer = require('nodemailer');

let smtpConfig = {
    host: "mail.wedotechstuff.com",
    port: 8889,
    secure: false,
    auth: {
        user: '' || process.env.EMAIL_USER,
        pass: '' || process.env.EMAIL_PASS,
    }
}


let transporter = nodemailer.createTransport(smtpConfig);

function sendVerificationEmail(req, user) {
    let message = {
        from: '"CiviDisc Server"',
        to: user.email,
        subject: "Welcome to Civi-Disc!  Please verify email.",
        text: `Thank you for joining Civi-Disc, ${ user.firstName } ${ user.lastName}.\n
                Please visit ${ req.protocol }/verifyUser/?id=${ user.Id } to finish the registration process and begin using CiviDisc!`,
        html: `<p>Thank you for joining Civi-Disc, ${ user.firstName } ${ user.lastName}.</p>
                <p>Please visit <a href="${ req.protocol }/verifyUser/?id=${ user.Id }">${ req.protocol }/verifyUser/?id=${ user.Id }</a> to finish the 
                registration process and begin using CiviDisc!</p>`,
        

    }

    return new Promise(function(resolve, reject) {
        transporter.sendMail(message, (err, info) => {
            if(err) {
                reject(err);
            }
            resolve(info);
        })
    })
}

module.exports = {
    sendVerificationEmail,
}