import Composer from "./composer";

expect.extend({
	toHaveEmittedEvent(composer, event) {
		return new Promise((resolve) => {
			const options = {
				comment: "within 100ms",
				isNot: this.isNot,
				promise: this.promise
			};
			const hint = this.utils.matcherHint("toHaveEmittedEvent", "composer", "event", options);
			const timeout = setTimeout(() => {
				resolve({
					message: () => {
						return `${hint}\n\nExpected event: ${this.utils.printExpected(event)}`;
					},
					pass: false
				});
			}, 100);
			composer.addEventListener(event, () => {
				clearTimeout(timeout);
				resolve({
					message: () => {
						return `${hint}\n\nReceived event: ${this.utils.printReceived(event)}`;
					},
					pass: true
				});
			});
		});
	}
});

it("should create a region", () => {
	const composer = new Composer();
	const region = composer.createRegion();
	expect(region).toEqual({
		height: 0,
		id: 1,
		width: 0,
		x: 0,
		y: 0
	});
});

it("should resize a region", () => {
	const composer = new Composer();
	const region = composer.createRegion();
	composer.resizeRegion(region, {
		height: 1080,
		width: 1920
	});
	expect(region).toEqual({
		height: 1080,
		id: 1,
		width: 1920,
		x: 0,
		y: 0
	});
});

it("should resize a region to even dimensions when given odd ones", () => {
	const composer = new Composer();
	const region = composer.createRegion();
	composer.resizeRegion(region, {
		height: 1079,
		width: 1919
	});
	expect(region).toEqual({
		height: 1080,
		id: 1,
		width: 1920,
		x: 0,
		y: 0
	});
});

it("should set a region's source", () => {
	const composer = new Composer();
	const region = composer.createRegion();
	composer.setRegionSource(region, "foo");
	expect(region).toEqual({
		height: 0,
		id: 1,
		source: "foo",
		width: 0,
		x: 0,
		y: 0
	});
});

it("should return its total height", () => {
	const composer = new Composer();
	const region = composer.createRegion();
	composer.resizeRegion(region, {
		height: 1080,
		width: 1920
	});
	return new Promise((resolve, reject) => {
		composer.addEventListener("update", () => {
			try {
				resolve(expect(composer.height).toBe(1080));
			} catch (error) {
				reject(error);
			}
		});
	});
});

it("should return its total width", () => {
	const composer = new Composer();
	const region = composer.createRegion();
	composer.resizeRegion(region, {
		height: 1080,
		width: 1920
	});
	return new Promise((resolve, reject) => {
		composer.addEventListener("update", () => {
			try {
				resolve(expect(composer.width).toBe(1920));
			} catch (error) {
				reject(error);
			}
		});
	});
});

it("should return its regions", () => {
	const composer = new Composer();
	const region = composer.createRegion();
	composer.resizeRegion(region, {
		height: 1080,
		width: 1920
	});
	expect(composer.regions).toEqual([{
		height: 1080,
		id: 1,
		width: 1920,
		x: 0,
		y: 0
	}]);
});

it("should emit an update when a region's dimensions have changed", async () => {
	const composer = new Composer();
	const region = composer.createRegion();
	composer.resizeRegion(region, { height: 1080, width: 1920 });
	await expect(composer).toHaveEmittedEvent("update");
	composer.resizeRegion(region, { height: 720, width: 1280 });
	await expect(composer).toHaveEmittedEvent("update");
});

it("shouldn't emit an update when a region's dimensions haven't changed", async () => {
	const composer = new Composer();
	const dimensions = { height: 1080, width: 1920 };
	const region = composer.createRegion();
	composer.resizeRegion(region, dimensions);
	await expect(composer).toHaveEmittedEvent("update");
	composer.resizeRegion(region, dimensions);
	await expect(composer).not.toHaveEmittedEvent("update");
});

it("should emit an update when a region's source has changed", async () => {
	const composer = new Composer();
	const region = composer.createRegion();
	composer.setRegionSource(region, "foo");
	await expect(composer).toHaveEmittedEvent("update");
	composer.setRegionSource(region, "bar");
	await expect(composer).toHaveEmittedEvent("update");
});

it("shouldn't emit an update when a region's source hasn't changed", async () => {
	const composer = new Composer();
	const region = composer.createRegion();
	composer.setRegionSource(region, "foo");
	await expect(composer).toHaveEmittedEvent("update");
	composer.setRegionSource(region, "foo");
	await expect(composer).not.toHaveEmittedEvent("update");
});

it("should remove a region", () => {
	const composer = new Composer();
	const region = composer.createRegion();
	expect(composer.regions).toHaveLength(1);
	composer.removeRegion(region);
	expect(composer.regions).toHaveLength(0);
});
