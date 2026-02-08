const nodemailer = require("nodemailer");
// const { frontend_url } = require("../controllers/authenticate");
const { frontend_url,EMAIL_PASSWORD } = require("../src/variables");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user:"chbouountito@gmail.com",
    // user: "maddison53@ethereal.email",
    pass: EMAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
// need to add user id here in order to get it in the frontend user
async function main(receiver,token) {
    // make this url same as,the frontend url
    const domain=`${frontend_url}/reset/password/${token}`
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "chbouountito@gmail.com", // sender address
    to: receiver, // list of receivers
    subject: "Paswword reset ✔ 👻", // Subject line
    text: "Hello", // plain text body
    html: `<h1>To reset your password,please click this <a href=${domain}>Link : ${domain}</a></h1>`, // html body
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
// main("")
module.exports={main};
// main().catch(console.error);

