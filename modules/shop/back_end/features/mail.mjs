import nodemailer from "nodemailer";

let testAccount = undefined;
let transporter = undefined;

const checkTransporter = async() => {
	if(transporter !== undefined){return;}
	testAccount = await nodemailer.createTestAccount();
	transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass
		}
	});
};

export const send = async (from,to,subject,text,html) => {
	await checkTransporter();

	const info = await transporter.sendMail({
		from:    from,
		to:      to,
		subject: subject,
		text:    text,
		html:    html
	});
	console.log("Message sent: %s", info.messageId);
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
