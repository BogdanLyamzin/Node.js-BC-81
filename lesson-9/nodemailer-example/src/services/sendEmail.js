import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_PASSWORD, UKR_NET_EMAIL} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, // 25, 2525, 587
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSWORD
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);
/*
const payload = {
    to: "reviva5584@18lover.com",
    subject: "Test email",
    html: "<strong>Test email</strong>"
};
*/
const sendEmail = payload => {
    const email = {...payload, from: UKR_NET_EMAIL};
    return transport.sendMail(email);
}

export default sendEmail;