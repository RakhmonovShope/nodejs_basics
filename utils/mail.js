import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'damian60@ethereal.email',
    pass: 'xjaXyu6HjG6dH9bWW7'
  }
});

const messageFunction = (message, callback) => {
  transporter
    .sendMail(message)
    .then(info => {
      callback(nodemailer.getTestMessageUrl(info));
    })
    .catch(err => console.log(err));
};

export default messageFunction;
