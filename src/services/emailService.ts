import nodemailer from 'nodemailer'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

type EmailService = {
    sendPasswordEmail: (password: string) => void
}

export const sendPasswordEmail = (
    email: string,
    password: string
): Promise<void> =>
    new EmailServiceImpl(email).sendPasswordEmail(password)



// email service  to made managing sending emails easy
class EmailServiceImpl implements EmailService {
    constructor(
        private readonly email: string
    ) {}

    async sendPasswordEmail(password: string) {
        const subject = 'Welcome To Billivance E-Learning';
        const message = `HI 👋 ,your account has been created 🔥, your password is ${password} \n and your login is ${this.email}`;
        try {
            // create reusable transporter object using the default SMTP transport
            const transporter = await nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.HOST || '22'),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL, // generated ethereal user
                    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false,
                },
            })

            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: process.env.EMAIL, // sender address
                cc: this.email,
                to: this.email, // list of receivers
                subject: subject, // Subject line
                html: `<b>${message}</b>`, // html body
            })

            console.log('Message sent: %s', info.messageId)

            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

        } catch (error) {
            console.log(error)
        }
    }

    // private getHtmlTemplate() {
    //     return ''
    // }
}
