module.exports = {
	presets: [["@babel/env", {
		bugfixes: true,
		shippedProposals: true,
		targets: { node: "18.10.0" }
	}], ["@babel/react", {
		runtime: "automatic"
	}]]
};
