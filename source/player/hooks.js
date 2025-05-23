import { useCallback, useEffect, useImperativeHandle, useRef } from "react";

import useStream from "../hook";
import Statistics from "../statistics";
import renderOverlay from "./render-overlay";

const useHooks = ({ debug, onRender, ref, source }) => {
	const canvas = useRef();
	const context = useRef();
	const loop = useRef();
	const region = useRef();
	const statistics = useRef();
	const stream = useStream();
	statistics.current ||= new Statistics();
	const render = useCallback(() => {
		statistics.current.start();
		const { height, id, width, x, y } = region.current;
		context.current.clearRect(0, 0, width, height);
		const coordinates = [x, y, width, height, 0, 0, width, height];
		let response = null;
		if (stream.metadata) {
			const { isValid, regions } = stream.metadata;
			if (isValid && regions[id]) {
				response = regions[id];
				let heightRatio = height / response.height;
				let widthRatio = width / response.width;
				if (Math.abs(widthRatio - heightRatio) > 0.01) {
					const ratio = Math.min(widthRatio, heightRatio);
					heightRatio = ratio;
					widthRatio = ratio;
				}
				coordinates[0] = response.x;
				coordinates[1] = response.y;
				coordinates[2] = response.width;
				coordinates[3] = response.height;
				coordinates[4] = Math.max(Math.trunc((width - response.width * widthRatio) / 2), 0);
				coordinates[5] = Math.max(Math.trunc((height - response.height * heightRatio) / 2), 0);
				coordinates[6] = response.width * widthRatio;
				coordinates[7] = response.height * heightRatio;
			}
		}
		context.current.drawImage(stream.video, ...coordinates);
		onRender?.(context.current, region.current, response, stream);
		if (debug) {
			renderOverlay(context.current, region.current, response, stream, statistics.current);
		}
		statistics.current.end();
	}, [debug, onRender, stream]);
	const renderLoop = useCallback(() => {
		render();
		loop.current = stream.requestFrameCallback(renderLoop);
	}, [render, stream]);
	const resize = useCallback(([{ contentRect: { height, width } }]) => {
		canvas.current.height = height * devicePixelRatio;
		canvas.current.width = width * devicePixelRatio;
		stream.composer.resizeRegion(region.current, canvas.current);
		render();
	}, [render, stream]);
	useEffect(() => {
		context.current = canvas.current.getContext("2d");
	}, []);
	useEffect(() => {
		region.current = stream.composer.createRegion();
		return () => {
			stream.composer.removeRegion(region.current);
		};
	}, [stream]);
	useEffect(() => {
		const observer = new ResizeObserver(resize);
		observer.observe(canvas.current);
		return () => {
			observer.disconnect();
		};
	}, [resize]);
	useEffect(() => {
		renderLoop();
		return () => {
			stream.cancelFrameCallback(loop.current);
		};
	}, [renderLoop, stream]);
	useEffect(() => {
		stream.composer.setRegionSource(region.current, source);
	}, [source, stream]);
	useImperativeHandle(ref, () => {
		return canvas.current;
	}, []);
	return canvas;
};

export default useHooks;
