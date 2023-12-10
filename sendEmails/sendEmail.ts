import { SendMailOptions } from 'nodemailer';
import { google } from 'googleapis';
//import dotenv from 'dotenv';
//import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';


dotenv.config();

const createTransporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  try {
    const accessToken = await new Promise<string>((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token as string); // 'token' の型を string として明示的にキャスト
      });
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    } as nodemailer.TransportOptions);

    return transporter;
  } catch (error: any) {
    throw new Error(`Failed to create access token: ${error.message}`);
  }
};


const sendEmail = async (emailOptions: SendMailOptions) => {
  try {
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
    console.log('Email sent successfully!');
  } catch (error: any) {
    console.error(`Error sending email: ${error.message}`);
  }
};

// locker No/pickup code/to email address
(async () => {
  await sendEmail({
    subject: 'Your parcel has arrived!',
    text: 'Your parcel is waiting for you in Locker 1. The pickup code is 1234.',
    to: 't2tato01@students.oamk.fi',
    from: process.env.EMAIL
  });
})();
