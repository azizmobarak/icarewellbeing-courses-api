import nodemailer from 'nodemailer'
// import SMTPTransport from 'nodemailer/lib/smtp-transport'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

type EmailService = {
    sendPasswordEmail: (password: string) => void
}

export const sendPasswordEmail = (
    email: string,
    password: string
): Promise<void> => new EmailServiceImpl(email).sendPasswordEmail(password)

export const senResetPasswordEmail = (
    email: string,
    token: string
): Promise<void> => new EmailServiceImpl(email).senResetPasswordEmail(token)

// email service  to made managing sending emails easy
class EmailServiceImpl implements EmailService {
    // private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
    constructor(private readonly email: string) {
        // create reusable transporter object using the default SMTP transport
    }

    async sendPasswordEmail(password: string) {
        const subject = 'Welcome To Billivance E-Learning'
        const message = `HI 👋 ,your account has been created 🔥, your password is ${password} \n and your login is ${this.email}`
        try {
            let transporter = nodemailer.createTransport({
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

    async senResetPasswordEmail(token: string) {
        console.log(token)
        const subject = 'Billivance - reset password'
        const message = `HI 👋 ,you requested to reset password, click on the link bellow to reset your password https://courses.billivance.com/resetPassword/${token}`
        try {
            let transporter = nodemailer.createTransport({
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
