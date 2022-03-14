/*
* This script will parse any HTML file in a specific folder and create a corresponding .txt file
* https://www.npmjs.com/package/htmlparser2
*/
import fs from "fs";
import htmlparser2WritableStream from "htmlparser2";
const WritableStream = new htmlparser2WritableStream();
const filesystem = new fs;
const parserStream = new WritableStream({
	ontext(text) {
		console.log("Streaming:", text);
	},
});

const htmlStream = filesystem.createReadStream("../modules/userLogin/back_end/templates/order.html");
htmlStream.pipe(parserStream).on("finish", () => console.log("done"));
parserStream.end();
filesystem.close();
