import ApiClient from "wrtc-ws-api-client";

import Statistics from "../statistics";
import Composer from "./composer";

class Stream {

	#apiClient = null;

	#composer = new Composer();

	#connection = null;

	#interval = null;

	#statistics = new Statistics();

	#timeout = null;

	#video = document.createElement("video");

	constructor(apiUrl, apiOptions) {
		this.#apiClient = new ApiClient(apiUrl, apiOptions);
		this.#apiClient.addEventListener("candidate", this.#handleCandidate);
		this.#apiClient.addEventListener("offer", this.#handleOffer);
		this.#composer.addEventListener("update", this.#sendState);
		this.#interval = setInterval(this.#updateStatistics, 1000);
		this.#video.muted = true;
	}

	get apiClient() {
		return this.#apiClient;
	}

	cancelFrameCallback = (handle) => {
		this.#video.cancelVideoFrameCallback?.(handle) || cancelAnimationFrame(handle);
	};

	close = () => {
		clearInterval(this.#interval);
		clearTimeout(this.#timeout);
		this.#apiClient?.close();
		this.#connection?.close();
		this.#video?.remove();
	};

	get composer() {
		return this.#composer;
	}

	#handleCandidate = ({ data: { candidate } }) => {
		this.#connection?.addIceCandidate(new RTCIceCandidate(candidate));
	};

	#handleOffer = async ({ data: { sdp } }) => {
		this.#connection?.close();
		this.#connection = new RTCPeerConnection();
		this.#connection.addEventListener("track", this.#handleTrack);
		await this.#connection.setRemoteDescription({ sdp, type: "offer" });
		await this.#connection.setLocalDescription(
			await this.#connection.createAnswer()
		);
		this.#apiClient.send({
			data: { sdp: this.#connection.localDescription.sdp },
			event: "answer"
		});
		this.#sendState();
	};

	#handleTrack = ({ track }) => {
		this.#video.srcObject = new MediaStream([track]);
		this.#video.play();
	};

	requestFrameCallback = (callback) => {
		return this.#video.requestVideoFrameCallback?.(callback) || requestAnimationFrame(callback);
	};

	#sendState = () => {
		clearTimeout(this.#timeout);
		this.#timeout = setTimeout(() => {
			const { height, regions, width } = this.#composer;
			this.#apiClient.send({
				data: { height, regions, width },
				event: "state"
			});
		}, 100);
	};

	get statistics() {
		return this.#statistics;
	}

	#updateStatistics = async () => {
		if (!this.#connection) {
			return;
		}
		for (const [, {
			framesDecoded,
			framesPerSecond,
			totalDecodeTime,
			type
		}] of await this.#connection.getStats()) {
			if (type === "inbound-rtp") {
				this.#statistics.update(framesPerSecond, totalDecodeTime * 1000 / framesDecoded);
				return;
			}
		}
	};

	get video() {
		return this.#video;
	}

}

export default Stream;
