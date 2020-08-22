import nodemailer from 'nodemailer'

export const email = process.env.EMAIL || 'casapazminoV3@gmail.com';
const pass = process.env.PASSWORD ||'fulltimev3';

const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: email,
      pass: pass
    }
});

export const enviarMail = function(data : any) {
    smtpTransport.sendMail(data, async (error: any, info: any) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
} 