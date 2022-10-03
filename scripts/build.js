const { promises: { copyFile, mkdir } } = require("fs");
const { join } = require("path");

(async () => {
	await mkdir(join(__dirname, "..", "dist"), { recursive: true });
	copyFile(
		join(__dirname, "..", "source", "index.d.ts"),
		join(__dirname, "..", "dist", "index.d.ts")
	);
})();
