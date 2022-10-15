import renderText from "./render-text";

const drawOverlay = (context, { height, id, source, width, x, y }, statistics) => {
	const fontSize = Math.floor(width >= height ? height / 12 : width / 16);
	const graphWidth = Math.floor(width / 8);
	const padding = Math.floor(fontSize / 4);
	const graphX = width - padding - graphWidth;
	const secondLine = fontSize + padding;
	context.fillStyle = "#FFFFFF";
	context.font = `${fontSize}px monospace`;
	context.lineWidth = fontSize / 30;
	context.miterLimit = 3;
	renderText(context, id, padding, padding, "left", "top");
	renderText(context, `${width}x${height}`, padding, secondLine, "left", "top");
	renderText(context, `${x},${y}`, padding, secondLine + fontSize, "left", "top");
	renderText(context, source, padding, height - padding, "left", "bottom");
	renderText(context, Date.now(), width - padding, height - padding, "right", "bottom");
	renderText(context, Math.round(statistics.frameRate), graphX - padding, padding, "right", "top");
	renderText(context, Math.round(statistics.frameTime), graphX - padding, secondLine, "right", "top");
	statistics.frameRateGraph.render(context, graphX, padding, graphWidth, fontSize);
	statistics.frameTimeGraph.render(context, graphX, secondLine, graphWidth, fontSize);
};

export default drawOverlay;
