import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "my-mail@mail.ru", // generated ethereal user
        pass: "password_mailru", // generated ethereal password
    },
});

export const mailer = (message: Options) => {
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(info);
    });
};

export const mailConstructor = (email: string, password: string): Options => {
    return {
        from: "my-mail@mail.ru",
        to: email,
        subject: "Message title",
        text: "Congratulations! You sign up to SHOP!",
        html: `
				<h3>You sign up to SHOP</h3>
				<p>Password: ${password}</p>
				<p>Login: ${email}</p>
				<div>For continue <a href="http://localhost:3000/login">confirm</a> your e-mail</div>`,
    };
};
