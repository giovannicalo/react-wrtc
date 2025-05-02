class Graph {

	#canvas = document.createElement("canvas");

	#context = this.#canvas.getContext("2d", { willReadFrequently: true });

	#maximum = null;

	constructor(maximum, width, height) {
		this.#canvas.height = height || 50;
		this.#canvas.width = width || 100;
		this.#maximum = maximum || 100;
		this.#drawBackground(0, this.#canvas.width);
	}

	#drawBackground(x, width) {
		this.#context.fillStyle = "#000000";
		this.#context.globalAlpha = 0.2;
		this.#context.fillRect(x, 0, width, this.#canvas.height);
		this.#context.globalAlpha = 1;
	}

	render = (context, x, y, width, height) => {
		context.drawImage(this.#canvas, x, y, width, height);
	};

	update = (value) => {
		const { height, width } = this.#canvas;
		const scaledValue = Math.round(Math.min(value / this.#maximum, 1) * height);
		const previousData = this.#context.getImageData(1, 0, width - 1, height);
		this.#context.clearRect(0, 0, width, height);
		this.#context.putImageData(previousData, 0, 0);
		this.#drawBackground(width - 1, 1);
		this.#context.fillStyle = "#FFFFFF";
		this.#context.fillRect(width - 1, height - scaledValue, 1, scaledValue);
	};

}

export default Graph;
