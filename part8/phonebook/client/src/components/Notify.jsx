const Notify = ({ message }) => {
	if (message === null) {
		return null;
	}

	return <div style={{ color: 'red' }}>{message}</div>;
};

export default Notify;
