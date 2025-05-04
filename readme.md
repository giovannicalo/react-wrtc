# React WebRTC

[![Build Status](https://github.com/giovannicalo/react-wrtc/actions/workflows/build.yml/badge.svg)](https://github.com/giovannicalo/react-wrtc/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/giovannicalo/react-wrtc/badge.svg?branch=master)](https://coveralls.io/github/giovannicalo/react-wrtc?branch=master)

## Installation

```bash
npm install giovannicalo/react-wrtc
```

> Not yet published to NPM. This will install it from GitHub.

## Usage

```javascript
import { Player, Provider, Stream } from "react-wrtc";

const stream = new Stream("ws://localhost:8080");

const Foo = () => {
    return <Provider stream={stream}>
        <Player source="foo" />
    </Provider>;
};

export default Foo;
```

## API

### `Context`

[React `Context`](https://reactjs.org/docs/context.html) wrapping a `Stream` instance.

### `Player`

Video player component. It must be placed inside a `Provider`.

Props are:

* `debug`: whether to render the debug overlay, defaults to `false`.
* `onRender` a function to be called on every video frame, in the form `(CanvasRenderingContext2D, Region, Stream): void`, defaults to `undefined`.
* `source`: a JSON-serializable identifier used to control what will be played, defaults to `undefined`.
* any [React View](https://github.com/giovannicalo/react-view) props.
* any [Styled Components](https://github.com/styled-components/styled-components) props.
* any [HTML Canvas Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) props.

### `Provider`

React `Context` `Provider` wrapping a `Stream` instance.

Props are:

* `stream`: a `Stream` instance, defaults to `undefined`

### `new Stream(apiUrl: string, apiOptions?: ApiClient.Options, decoder?: Decoder)`

Creates an [API client](https://github.com/giovannicalo/js-wrtc-ws-api-client) with the given `apiOptions` that will try to connect to the server running at `apiUrl`. Upon success, it will initialize a [WebRTC connection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) and request to play the `source`s of any associated `Player`s.

For the WebSocket signaling connection to be successfully established, the API server should accept the following message:

* `{ data: { role, ... }, event: "handshake" }`: use this for authentication.

It should also send the following message:

* `{ data: { id }, event: "handshake" }`: use this to acknowledge a successful `handshake` and give the client an ID.

For the WebRTC connection to be established, the media server must accept the following messages:

* `{ data: { sdp }, event: "answer" }`: use this to set its `RTCPeerConnection`'s `remoteDescription`.
* `{ data: { height, regions, width }, event: "state" }`: use this to set frame and region dimensions and sources.

It must also send the following messages:

* `{ data: { candidate }, event: "candidate" }`: when its own `RTCPeerConnection`'s `icecandidate` event occurs.
* `{ data: { sdp }, event: "offer" }`: upon connection, with its `RTCPeerConnection`' `localDescription`.

An optional `decoder` can be provided to decode any metadata present in the video frames.

#### `apiClient: ApiClient`

The `Stream`'s `ApiClient`. It can be used to e.g. send custom messages to the server.

#### `cancelFrameCallback(handle: number): void`

A convenient wrapper around [`cancelVideoFrameCallback`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/cancelVideoFrameCallback) or [`cancelAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame), depending on what's available.

#### `close(): void`

Permanently closes the `Stream`.

#### `composer: Composer`

The `Stream`'s `Composer`. It can be used e.g. to add regions that will be used by a custom player.

#### `decoder: Decoder`

The `Stream`'s metadata `Decoder`, if any.

#### `metadata: any`

Metadata for the current frame, if any.

#### `requestFrameCallback(callback: () => void): number`

A convenient wrapper around [`requestVideoFrameCallback`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback) or [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), depending on what's available.

#### `video: HTMLVideoElement`

The `Stream`'s [`HTMLVideoElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement). It can be used e.g. to read custom parts of the stream.

### `useStream(): Stream`

[React Hook](https://reactjs.org/docs/hooks-intro.html) returning the context's `Stream` instance. It can only be used inside a `Provider`.
