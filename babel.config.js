module.exports = {
	presets: [["@babel/env", {
		bugfixes: true,
		shippedProposals: true,
		targets: { node: "24.0.2" }
	}], ["@babel/react", {
		runtime: "automatic"
	}]]
};
