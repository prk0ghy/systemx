/*
* This script will parse any HTML file in a specific folder and create a corresponding .txt file
* https://www.npmjs.com/package/htmlparser2
*/
import fs from "fs";
import htmlparser2 from "htmlparser2";
import * as constants from "constants";
// import WritableStream from "htmlparser2";

let streamParam = {
	ontext(text) {
		console.log("Streaming:", JSON.stringify(text, null, 4));
	},
}

let parserStream = new htmlparser2.Parser(streamParam);
function read(path, optoions, callback) {
	console.log(data)
};

let inputStream;
inputStream = fs.readFile("/Users/prk0ghy/Repositories/Digitale_Lernwelten/systemx/modules/userLogin/back_end/templates/passwordResetMail.html", read()
)


parserStream.write(inputStream);


fs.close(0);
parserStream.end();
