const nodemailer = require('nodemailer')
const util = require('util');
const emailctt = "havealoficial@outlook.com"
const emailcttpwd = process.env.PWDMAIL
const transporter = nodemailer.createTransport({
    host:"smtp.office365.com",
    port: 587,
    auth: {
        user: emailctt,
        pass: emailcttpwd, 
    }
})

const sendMailAsync = util.promisify(transporter.sendMail).bind(transporter);

async function sendMail(email, slug, type) {
    if (type === 1 || !email || !type || !slug) {
        try {
            const info = await sendMailAsync({
                from: emailctt,
                to: email,
                subject: "Haveal autentication",
                html: `<p>Clique no link abaixo para autenticar:</p><a href='${process.env.FRONTEND}/auth/emailverify/verify/${slug}'>Link de Autenticação</a>`
            });
            if(info){
                 return true;
            }else{
                throw new Error("Erro ao enviar email: " + error);
            }
           
        } catch (error) {
            throw new Error("Erro ao enviar email: " + error);
        }
    } else {
        throw new Error("'Type' especificado não existe");
    }
}
module.exports = sendMail