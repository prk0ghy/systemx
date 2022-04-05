import nodemailer from "nodemailer";
import Template from "./template.mjs";

const requiredEnv = [
	"SYSTEMX_MAIL_HOST",
	"SYSTEMX_MAIL_PORT",
	"SYSTEMX_MAIL_USER",
	"SYSTEMX_MAIL_PASSWORD",
	"SYSTEMX_MAIL_FROM"
];

const createTransporter = () => {
	for (const key of requiredEnv) {
		if (!process.env[key]){
			throw new Error(`incomplete mail config: key '${key}' is required`);
		}
	}
	return nodemailer.createTransport({
		host: process.env.SYSTEMX_MAIL_HOST,
		port: process.env.SYSTEMX_MAIL_PORT,
		secure: process.env.SYSTEMX_MODE === "production",
		logger: true,
		debug: process.env.SYSTEMX_MODE === "development",
		auth: {
			user: process.env.SYSTEMX_MAIL_USER,
			pass: process.env.SYSTEMX_MAIL_PASSWORD
		}
	});
};

const transporter = createTransporter();

export const sendRaw = ({from=null,to,subject,text,html}) => {
	return transporter.sendMail({
		from:    from,
		to:      to,
		subject: subject,
		text:    text,
		html:    html
	});
};

const subjectRegex = /<title>([^<]*)<\/title>/;
export const sendMail = async ({to, template, values}) => {
	if(!to){return false;}
	const from = process.env.SYSTEMX_MAIL_FROM;
	const html = await Template(template+".html", values);
	if(!html){return false;}
	const text = await Template(template+".txt",  values);
	if(!text){return false;}
	const matches = html.match(subjectRegex);
	if(!matches || (matches.length < 2)){
		console.error("Couldn't find a valid <title> in "+template);
		return false;
	}
	const subject = String(matches[1]);
	return await sendRaw({from,to,subject,html,text});
};

export default sendMail;
