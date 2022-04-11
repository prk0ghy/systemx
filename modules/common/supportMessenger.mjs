import axios from 'axios';

const postMessage = async msg => {
	const slackToken = process.env.SYSTEMX_SLACK_TOKEN;
	const slackChannel = process.env.SYSTEMX_SLACK_CHANNEL;
	const url = 'https://slack.com/api/chat.postMessage';

	if (!slackToken) {
		return;
	}

	await axios.post(url, {
		channel: msg.channel || slackChannel,
		text: msg.text,
	}, {headers: {authorization: `Bearer ${slackToken}`}});
};

export default postMessage;
