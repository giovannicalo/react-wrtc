import { useContext } from "react";

import Context from "./context";

const useWebrtc = () => {
	return useContext(Context);
};

export default useWebrtc;
