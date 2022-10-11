import ShelfPack from "@mapbox/shelf-pack";

class Composer extends EventTarget {

	#nextId = 0;

	#packTimeout = null;

	#packer = new ShelfPack(0, 0, { autoResize: true });

	#regions = {};

	#updateTimeout = null;

	createRegion = () => {
		const id = ++this.#nextId;
		this.#regions[id] = {
			height: 0,
			id,
			width: 0,
			x: 0,
			y: 0
		};
		return this.#regions[id];
	};

	#emitUpdate = () => {
		clearTimeout(this.#updateTimeout);
		this.#updateTimeout = setTimeout(() => {
			this.dispatchEvent(new Event("update"));
		}, 10);
	};

	get height() {
		return this.#packer.h;
	}

	get regions() {
		return Object.values(this.#regions);
	}

	#pack = () => {
		clearTimeout(this.#packTimeout);
		this.#packTimeout = setTimeout(() => {
			this.#packer.clear();
			this.#packer.pack(this.regions, { inPlace: true });
			this.#emitUpdate();
		}, 10);
	};

	resizeRegion = ({ id }, { height, width }) => {
		const {
			height: currentHeight,
			width: currentWidth
		} = this.#regions[id];
		const evenHeight = height + 1 & ~1;
		const evenWidth = width + 1 & ~1;
		if (currentHeight !== evenHeight || currentWidth !== evenWidth) {
			this.#regions[id].height = evenHeight;
			this.#regions[id].width = evenWidth;
			this.#pack();
		}
	};

	setRegionSource = ({ id }, source) => {
		if (this.#regions[id].source !== source) {
			this.#regions[id].source = source;
			this.#emitUpdate();
		}
	};

	removeRegion = ({ id }) => {
		delete this.#regions[id];
		this.#pack();
	};

	get width() {
		return this.#packer.w;
	}

}

export default Composer;
