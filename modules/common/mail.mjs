import nodemailer from "nodemailer";
import Options from "./options.mjs";

const sendMail = await (async () => {
	const testAccount = await nodemailer.createTestAccount();
	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass
		}
	});

	const send = async ({from=null,to,subject,text,html}) => {
		if(from === null){
			return send({from: Options.mailFrom,to,subject,text,html});
		}
		const info = await transporter.sendMail({
			from:    from,
			to:      to,
			subject: subject,
			text:    text,
			html:    html
		});
		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		return info;
	};
	return send;
})();
export default sendMail;
