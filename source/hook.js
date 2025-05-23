import { useContext } from "react";

import Context from "./context";

const useStream = () => {
	return useContext(Context);
};

export default useStream;
