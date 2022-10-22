import renderText from "./render-text";

const renderGraphs = (context, statistics, x, y, width, height, padding) => {
	renderText(context, Math.round(statistics.frameRate), x - padding, y, "right", "top");
	statistics.frameRateGraph.render(context, x, y, width, height);
	renderText(context, Math.round(statistics.frameTime), x - padding, y + height, "right", "top");
	statistics.frameTimeGraph.render(context, x, y + height, width, height);
};

export default renderGraphs;
