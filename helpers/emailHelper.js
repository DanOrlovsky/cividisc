const nodemailer = require('nodemailer');
//173.230.140.34
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
        from: 'civi-disc@wedotechstuff.com',
        to: user.email,
        subject: "Welcome to Civi-Disc!  Please verify email.",
        text: `Thank you for joining Civi-Disc, ${ user.firstName } ${ user.lastName}.\n
                Please visit ${ req.headers.refer }/verifyUser/${ user.id } to finish the registration process and begin using CiviDisc!`,
        html: `<p>Thank you for joining Civi-Disc, ${ user.firstName } ${ user.lastName}.</p>
                <p>Please visit <a href="${ req.headers.referer }/verifyUser/${ user.id }">${ req.headers.referer }/verifyUser/${ user.id }</a> to finish the 
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