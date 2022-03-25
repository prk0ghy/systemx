import nodemailer from "nodemailer";
import Template from "./template.mjs";
import Options from "./options.mjs";

const transporter = nodemailer.createTransport({
	host: Options.email.host,
	port: Options.email.port,
	secure: Options.mode === "production",
	logger: true,
	debug: Options.mode === "development",
	auth: {
		user: Options.email.username,
		pass: Options.email.password
	}
});

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
	const from = Options.mailFrom;
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
