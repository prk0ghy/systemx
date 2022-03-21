/*
* This script will parse any HTML file in a specific folder and create a corresponding .txt file
* https://www.npmjs.com/package/htmlparser2
*/
import { rejects } from "assert";
import fs from "fs";
import htmlparser2 from "htmlparser2";
import { resolve } from "path";

let mailText = "";
const parserStream = new htmlparser2.Parser({
	ontext(text) {
		if (text.trim() != "") {
			if (text.slice(0,-1) =="ö" ||text.slice(0,-1) =="ä" || text.slice(0,-1) =="ü") {
				mailText += text.trim();
			}
			else {
				mailText += "\n" + text.trim();
			}
		}
	},
	onclosetag() {
		write_emailtext();
	}
});

fs.readFile("/var/www/html/systemx/modules/userLogin/back_end/templates/passwordResetMail.html", (err,data) => {
	if (err) {
		return;
	}
	parserStream.write(data);
	parserStream.end();
});

console.log(mailText);


function write_emailtext() {
	fs.writeFile(("/var/www/html/systemx/modules/userLogin/back_end/templates/" + "passwordResetMail.txt"), mailText , err => {
		if (err) {
			rejects(err);
			return;
		}
	})

};
fs.close(0);
