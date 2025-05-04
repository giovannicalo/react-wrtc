import type { Context, Provider, ReactElement } from "react";
import type { ViewProps } from "react-view";
import type ApiClient from "wrtc-ws-api-client";

type Dimensions = {
	height: number;
	width: number;
};

type Region = {
	height: number;
	id: number;
	source?: ApiClient.JsonSerializable;
	width: number;
	x: number;
	y: number;
};

type PlayerProps = ViewProps & {
	debug?: boolean;
	onRender?(
		context: CanvasRenderingContext2D,
		region: Region,
		stream: Stream
	): void;
	source?: ApiClient.JsonSerializable;
};

type ProviderProps = {
	stream: Stream;
};

declare class Composer {
	createRegion(): Region;
	get height(): number;
	get regions(): Region[];
	resizeRegion(region: Region, dimensions: Dimensions): void;
	setRegionSource(region: Region, source: ApiClient.JsonSerializable): void;
	removeRegion(region: Region): void;
	get width(): number;
}

declare const Context: Context<Stream>;

declare class Decoder {
	constructor();
	close(): void;
	get data(): any;
	decode(stream: Stream): void;
}

declare class Graph {
	constructor(maximum: number, width?: number, height?: number);
	render(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
	update(value: number): void;
}

declare function Player(props: PlayerProps): ReactElement;

declare function Provider(props: ProviderProps): ReactElement;

declare class Statistics {
	end(): void;
	get frameRate(): number;
	get frameRateGraph(): Graph;
	get frameTime(): number;
	get frameTimeGraph(): Graph;
	start(): void;
	update(frameRate: number, frameTime: number): void;
}

declare class Stream {
	constructor(
		apiUrl: string,
		apiOptions: ApiClient.Options,
		decoder: Decoder
	);
	get apiClient(): ApiClient;
	cancelFrameCallback(handle: number): void;
	close(): void;
	get composer(): Composer;
	get decoder(): Decoder;
	get metadata(): any;
	requestFrameCallback(callback: () => void): number;
	get statistics(): Statistics;
	get video(): HTMLVideoElement;
}

declare function useStream(): Stream;

export { Context, Player, Provider, Stream, useStream };
