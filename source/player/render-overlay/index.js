import renderGraphs from "./render-graphs";
import renderText from "./render-text";

const renderOverlay = (context, { height, id, source, width, x, y }, stream, statistics) => {
	const { decoder } = stream;
	const fontSize = Math.floor(width >= height ? height / 12 : width / 16);
	const graphWidth = Math.floor(width / 8);
	const padding = Math.floor(fontSize / 4);
	const graphX = width - padding - graphWidth;
	const secondLine = fontSize + padding;
	const thirdLine = secondLine + fontSize;
	const fifthLine = thirdLine + fontSize * 2;
	context.fillStyle = "#FFFFFF";
	context.font = `${fontSize}px monospace`;
	context.lineWidth = fontSize / 30;
	context.miterLimit = 3;
	renderText(context, id, padding, padding, "left", "top");
	renderText(context, `${width}x${height}`, padding, secondLine, "left", "top");
	renderText(context, `${x},${y}`, padding, thirdLine, "left", "top");
	renderText(context, source, padding, height - padding, "left", "bottom");
	renderText(context, Date.now(), width - padding, height - padding, "right", "bottom");
	renderGraphs(context, stream.statistics, graphX, padding, graphWidth, fontSize, padding);
	if (decoder) {
		renderGraphs(context, decoder.statistics, graphX, thirdLine, graphWidth, fontSize, padding);
	}
	renderGraphs(context, statistics, graphX, decoder ? fifthLine : thirdLine, graphWidth, fontSize, padding);
};

export default renderOverlay;
