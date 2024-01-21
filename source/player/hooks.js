import { useCallback, useEffect, useImperativeHandle, useRef } from "react";

import renderOverlay from "./render-overlay";
import useStream from "../hook";
import Statistics from "../statistics";

const useHooks = ({ debug, onRender, ref, source }) => {
	const canvas = useRef();
	const context = useRef();
	const loop = useRef();
	const region = useRef();
	const statistics = useRef();
	const stream = useStream();
	statistics.current ||= new Statistics();
	const render = useCallback(() => {
		statistics.current?.start();
		const { height, width, x, y } = region.current;
		context.current.clearRect(0, 0, width, height);
		context.current.drawImage(stream.video, x, y, width, height, 0, 0, width, height);
		onRender?.(context.current, region.current);
		if (debug) {
			renderOverlay(context.current, region.current, stream.statistics, statistics.current);
		}
		statistics.current?.end();
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
