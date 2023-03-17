import React from "react";

const Notification = ({ message, error }) => {
	if (message === null) {
		return null;
	}

	let style;
	error ? style = "error" : style = "notification";

	return <div className={style}>{message}</div>;
};

export default Notification;
