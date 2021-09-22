import axios from "axios";
import options from "./options.mjs";

const postMessage = async msg => {
	const slackToken = options.slackToken;
	const slackChannel = options.slackChannel;
	const url = 'https://slack.com/api/chat.postMessage';

	if(!slackToken){return;}
	const res = await axios.post(url, {
		channel: msg.channel || slackChannel,
		text: msg.text
	}, { headers: { authorization: `Bearer ${slackToken}` } });
};

export default postMessage;
