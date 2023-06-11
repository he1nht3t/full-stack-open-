type NotificationProps = {
	message: string | null;
	type: 'success' | 'error';
};

const Notification = (props: NotificationProps) => {
	if (props.message === null) {
		return null;
	}

	const notificationStyle = {
		color: props.type === 'success' ? 'green' : 'red',
		background: 'lightgrey',
		fontSize: 20,
		borderStyle: 'solid',
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	};

	return <div style={notificationStyle}>{props.message}</div>;
};

export default Notification;
