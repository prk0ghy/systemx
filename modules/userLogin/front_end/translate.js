const sentences = {
	"Invalid Username/Password combination": "Ungültige E-Mail/Passwort Kombination"
};

const translateSentence = raw => sentences[raw] || raw;
export default translateSentence;
