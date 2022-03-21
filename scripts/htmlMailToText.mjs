/*
* This script will parse any HTML file in a specific folder and create a corresponding .txt file
* https://www.npmjs.com/package/htmlparser2
*/
import fs from "fs";
import htmlparser2 from "htmlparser2";
import { WritableStream } from "htmlparser2/lib/WritableStream";

let streamParam = {
	ontext(text) {
		console.log("Streaming:", JSON.stringify(text, null, 4));
	},
}

let parserStream = new WritableStream(streamParam);

const inputStream = fs.createReadStream("/Users/prk0ghy/Repositories/Digitale_Lernwelten/systemx/modules/userLogin/back_end/templates/passwordResetMail.html");

inputStream.pipe(parserStream).on("finish", console.log());
//parserStream.parseComplete(inputStream);


fs.close(0);
parserStream.end();
