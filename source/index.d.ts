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
	onRender?(context: CanvasRenderingContext2D, region: Region): void;
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

declare function Player(props: PlayerProps): ReactElement;

declare function Provider(props: ProviderProps): ReactElement;

declare class Stream {
	constructor(apiUrl: string, apiOptions: ApiClient.Options);
	get apiClient(): ApiClient;
	cancelFrameCallback(handle: number): void;
	close(): void;
	get composer(): Composer;
	requestFrameCallback(callback: () => void): number;
	get video(): HTMLVideoElement;
}

declare function useStream(): Stream;

export { Context, Player, Provider, Stream, useStream };
