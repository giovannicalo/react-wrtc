module.exports = {
	presets: [["@babel/env", {
		bugfixes: true,
		shippedProposals: true,
		targets: { node: "21.6.0" }
	}], ["@babel/react", {
		runtime: "automatic"
	}]]
};
