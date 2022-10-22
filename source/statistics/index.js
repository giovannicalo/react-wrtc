import Graph from "./graph";

class Statistics {

	#frameCount = 0;

	#frameRate = 0;

	#frameRateGraph = new Graph(60);

	#frameStartTime = performance.now();

	#frameTime = 0;

	#frameTimeGraph = new Graph(16);

	#previousUpdateTime = performance.now();

	#totalFrameTime = 0;

	end = () => {
		const currentTime = performance.now();
		this.#frameCount++;
		this.#totalFrameTime += currentTime - this.#frameStartTime;
		if (currentTime >= this.#previousUpdateTime + 1000) {
			const frameRate = this.#frameCount * 1000 / (currentTime - this.#previousUpdateTime);
			this.update(frameRate, this.#totalFrameTime / frameRate);
			this.#frameCount = 0;
			this.#previousUpdateTime = currentTime;
			this.#totalFrameTime = 0;
		}
	};

	get frameRate() {
		return this.#frameRate;
	}

	get frameRateGraph() {
		return this.#frameRateGraph;
	}

	get frameTime() {
		return this.#frameTime;
	}

	get frameTimeGraph() {
		return this.#frameTimeGraph;
	}

	start = () => {
		this.#frameStartTime = performance.now();
	};

	update = (frameRate, frameTime) => {
		this.#frameRate = frameRate;
		this.#frameRateGraph.update(frameRate);
		this.#frameTime = frameTime;
		this.#frameTimeGraph.update(frameTime);
	};

}

export default Statistics;
