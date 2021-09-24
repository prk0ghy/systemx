import nodemailer from "nodemailer";
import Template from "./template.mjs";
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

	const sendRaw = async ({from=null,to,subject,text,html}) => {
		const info = await transporter.sendMail({
			from:    from,
			to:      to,
			subject: subject,
			text:    text,
			html:    html
		});
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		return info;
	};

	const subjectRegex = /<title>([^<]*)<\/title>/;
	const send = async ({from=null, to, template, values}) => {
		if(from === null){
			return send({from: Options.mailFrom, to, template, values});
		}
		const html = await Template(template+".html", values);
		const text = await Template(template+".txt",  values);
		const matches = html.match(subjectRegex);
		if(matches.length < 2){
			console.error("Couldn't find a valid <title> in "+template);
			return;
		}
		const subject = String(matches[1]);
		await sendRaw({from,to,subject,html,text});
	};
	return send;
})();
export default sendMail;
