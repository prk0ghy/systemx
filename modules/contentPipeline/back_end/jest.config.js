module.exports = {
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.mjs$",
	testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
	transform: {
		"^.+\\.mjs$": "babel-jest"
	},
	moduleFileExtensions: ["js", "mjs"]
};
