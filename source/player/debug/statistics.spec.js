import Statistics from "./statistics";

jest.mock("./graph", () => {
	return jest.fn().mockImplementation(() => {
		return { update: jest.fn() };
	});
});

global.performance = { now: jest.fn() };

const mockFrame = (statistics, start, end) => {
	global.performance.now.mockReturnValueOnce(start);
	statistics.start();
	global.performance.now.mockReturnValueOnce(end);
	statistics.end();
};

const mockFrames = (statistics, start, end, rate, time) => {
	const interval = 1000 / rate;
	for (let i = 0; i < (end - start) / interval; i++) {
		const frameStart = start + i * interval;
		mockFrame(statistics, frameStart, frameStart + time);
	}
};

beforeEach(() => {
	global.performance.now.mockReturnValueOnce(0);
	global.performance.now.mockReturnValueOnce(0);
});

it("should return the average frame rate for the last second", () => {
	const statistics = new Statistics();
	mockFrames(statistics, 0, 1000, 1, 1000);
	expect(statistics.frameRate).toBe(1);
	mockFrames(statistics, 1000, 2000, 10, 100);
	expect(statistics.frameRate).toBe(10);
	mockFrames(statistics, 2000, 4001, 60, 16);
	expect(statistics.frameRate).toBe(60);
});

it("should return the average frame time for the last second", () => {
	const statistics = new Statistics();
	mockFrames(statistics, 0, 1000, 1, 1000);
	expect(statistics.frameTime).toBe(1000);
	mockFrames(statistics, 1000, 2000, 10, 100);
	expect(statistics.frameTime).toBe(100);
	mockFrames(statistics, 2000, 4001, 60, 16);
	expect(statistics.frameTime).toBe(16);
});

it("should not update more than once per second", () => {
	const statistics = new Statistics();
	mockFrames(statistics, 0, 1000, 10, 100);
	expect(statistics.frameRate).toBe(10);
	expect(statistics.frameTime).toBe(100);
	mockFrames(statistics, 1000, 1999, 60, 16);
	expect(statistics.frameRate).toBe(10);
	expect(statistics.frameTime).toBe(100);
	mockFrames(statistics, 2000, 4001, 60, 16);
	expect(statistics.frameRate).toBe(60);
	expect(statistics.frameTime).toBe(16);
});

it("should return the frame rate graph", () => {
	expect(new Statistics().frameRateGraph).toBeDefined();
});

it("should return the frame time graph", () => {
	expect(new Statistics().frameTimeGraph).toBeDefined();
});
