/*
* This script will parse any HTML file in a specific folder and create a corresponding .txt file
* https://www.npmjs.com/package/htmlparser2
*/
import fs from "fs";
import htmlparser2 from "htmlparser2";

let mailText = "";
const parserStream = new htmlparser2.Parser({
	ontext(text) {
		//if (text != "") {
		mailText += text;
		//}
	}, onclosetag() {
		write_emailtext();
	}
});

fs.readFile("/var/www/html/systemx/modules/userLogin/back_end/templates/passwordResetMail.html", (err, data) => {
	if (err) {
		throw err;
	}
	parserStream.write(data);
	parserStream.end();
});

console.log(mailText);


function write_emailtext() {
	fs.writeFile("/var/www/html/systemx/modules/userLogin/back_end/templates/passwordResetMail.txt", mailText, err => {
		if (err) {
			throw err;
		}
	})
	fs.close(0);
	//fs.closeSync(0);
}
