module.exports = {
	presets: [["@babel/env", {
		bugfixes: true,
		shippedProposals: true,
		targets: { node: "22.6.0" }
	}], ["@babel/react", {
		runtime: "automatic"
	}]]
};
