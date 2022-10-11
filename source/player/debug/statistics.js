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
			const timeUnit = 1000 / (currentTime - this.#previousUpdateTime);
			this.#frameRate = this.#frameCount * timeUnit;
			this.#frameRateGraph.update(this.#frameRate);
			this.#frameTime = this.#totalFrameTime / this.#frameCount * timeUnit;
			this.#frameTimeGraph.update(this.#frameTime);
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

}

export default Statistics;
