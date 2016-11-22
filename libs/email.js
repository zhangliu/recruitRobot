const nodemailer = require('nodemailer');
import config from '../config'

const transporter = nodemailer.createTransport(config.email.sender);

// setup e-mail data with unicode symbols
const mailOptions = {
  from: config.email.sender.auth.user,
  to: config.email.receivers, // list of receivers
  subject: '[recruit robot]: notice!', // Subject line
  text: 'empty content', // plaintext body
  html: '', // html body
};

const sendMail = async (subject, message) => {
  return await new Promise((resolve, reject) => {
    transporter.sendMail(
      Object.assign({}, mailOptions, {subject, text: message}),
      (error, info) => {
        if (error) {
          reject(error);
        }
        resolve(info.response);
      }
    )
  })
}

export default {
  sendMail,
}