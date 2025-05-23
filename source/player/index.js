import { memo } from "react";

import useHooks from "./hooks";
import Canvas from "./style";

const Player = memo(({ debug, onRender, ref, source, ...otherProps }) => {
	const canvas = useHooks({ debug, onRender, ref, source });
	return <Canvas
		element="canvas"
		height={0}
		ref={canvas}
		width={0}
		{...otherProps}
	/>;
});

export default Player;
