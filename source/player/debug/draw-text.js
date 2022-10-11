const drawText = (context, text, x, y, horizontalAlignment, verticalAlignment) => {
	context.textAlign = horizontalAlignment;
	context.textBaseline = verticalAlignment;
	context.fillText(text, x, y);
	context.strokeText(text, x, y);
};

export default drawText;
