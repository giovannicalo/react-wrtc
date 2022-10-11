import { forwardRef, memo } from "react";

import useHooks from "./hooks";
import Canvas from "./style";

// eslint-disable-next-line react/no-multi-comp
const Player = memo(forwardRef(({ source, ...otherProps }, ref) => {
	const canvas = useHooks({ ref, source });
	return <Canvas
		element="canvas"
		height={0}
		ref={canvas}
		width={0}
		{...otherProps}
	/>;
}));

export default Player;
