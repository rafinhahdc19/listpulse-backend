const nodemailer = require('nodemailer');
const util = require('util');

const emailctt = 'listpulse@outlook.com.br';
const emailcttpwd = process.env.PWDMAIL;

if (!emailcttpwd) {
  throw new Error('A variável de ambiente PWDMAIL não está configurada.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // Usar TLS
  requireTLS: true, // Exigir TLS
  auth: {
    user: emailctt,
    pass: emailcttpwd,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});

const sendMailAsync = util.promisify(transporter.sendMail).bind(transporter);

async function sendMail(email, slug, type) {
  if (type === 1 || !email || !type || !slug) {
    try {
      const info = await sendMailAsync({
        from: emailctt,
        to: email,
        subject: 'listpulse autenticação',
        html: `<p>Clique no link abaixo para autenticar:</p><a href='${process.env.FRONTEND}/auth/emailverify/verify/${slug}'>Link de Autenticação</a>`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error.message);
      throw new Error('Erro ao enviar e-mail. Consulte os logs para obter mais informações.');
    }
  } else {
    console.error("type === 1 || !email || !type || !slug");
    throw new Error("'Type' especificado não existe");
  }
}

module.exports = sendMail;
