import nodemailer from "nodemailer";
import Template from "./template.mjs";
import Options from "./options.mjs";

const transporter = nodemailer.createTransport({
	host: Options.email.host,
	port: Options.email.port,
	secure: true,
	logger: true,
	debug: true,
	auth: {
		user: Options.email.username,
		pass: Options.email.password
	}
});

const sendRaw = ({from=null,to,subject,text,html}) => {
	return transporter.sendMail({
		from:    from,
		to:      to,
		subject: subject,
		text:    text,
		html:    html
	});
};

const subjectRegex = /<title>([^<]*)<\/title>/;
const sendMail = async ({from=null, to, template, values}) => {
	console.log("Sending!");
	if(!to){
		return false;
	}
	if(from === null){
		return await sendMail({from: Options.mailFrom, to, template, values});
	}
	const html = await Template(template+".html", values);
	const text = await Template(template+".txt",  values);
	const matches = html.match(subjectRegex);
	if(matches.length < 2){
		console.error("Couldn't find a valid <title> in "+template);
		return false;
	}
	const subject = String(matches[1]);
	return await sendRaw({from,to,subject,html,text});
};
//console.log(await sendRaw({from:"tagungsbaende@dilewe.de", to: "bennyschulenburg@gmx.de", subject: "Test", text: "Test", html: "Test"}));

export default sendMail;
