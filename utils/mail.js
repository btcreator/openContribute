const nodemailer = require("nodemailer");

class Email {
  #email;
  #transport;

  constructor(email) {
    this.#email = email;

    // create a transporter
    this.#transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  // send mail with the provided credentials
  async send(subject, text, html) {
    const credentials = {
      from: '"OpenContribute" <service@opencontribute.com>',
      to: this.#email,
      subject,
      text,
    };

    // html version is optional
    if (html) credentials.html = html;

    await this.#transport.sendMail(credentials);
  }
}

module.exports = Email;
