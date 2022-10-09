import ShelfPack from "@mapbox/shelf-pack";

class Composer extends EventTarget {

	#nextId = 0;

	#packer = new ShelfPack(0, 0, { autoResize: true });

	#regions = {};

	#timeout = null;

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

	get height() {
		return this.#packer.h;
	}

	get regions() {
		return Object.values(this.#regions);
	}

	#pack = () => {
		clearTimeout(this.#timeout);
		this.#timeout = setTimeout(() => {
			this.#packer.clear();
			this.#packer.pack(this.regions, { inPlace: true });
			this.dispatchEvent(new Event("update"));
		}, 10);
	};

	resizeRegion = ({ id }, { height, width }) => {
		this.#regions[id].height = height + 1 & ~1;
		this.#regions[id].width = width + 1 & ~1;
		this.#pack();
	};

	setRegionSource = ({ id }, source) => {
		this.#regions[id].source = source;
		this.dispatchEvent(new Event("update"));
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
