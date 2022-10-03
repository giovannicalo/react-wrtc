import Context from "./context";

const Provider = ({ children, stream }) => {
	return <Context.Provider value={stream}>
		{children}
	</Context.Provider>;
};

export default Provider;
