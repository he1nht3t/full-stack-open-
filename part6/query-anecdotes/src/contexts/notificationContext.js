import { createContext, useReducer, useContext } from 'react';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
	switch (action.type) {
		case 'SET_NOTIFICATION':
			return action.payload;
		case 'REMOVE_NOTIFICATION':
			return null;
		default:
			return state;
	}
};

export const NotificationProvider = ({ children }) => {
	const [notification, notificationDispatch] = useReducer(
		notificationReducer,
		null
	);

	return (
		<NotificationContext.Provider
			value={{ notification, notificationDispatch }}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			'useNotification must be used within a NotificationProvider'
		);
	}
	return context.notification;
};

export const useSetNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			'useSetNotification must be used within a NotificationProvider'
		);
	}

	const setNotification = (notification) => {
		context.notificationDispatch({
			type: 'SET_NOTIFICATION',
			payload: notification,
		});
	};

	return setNotification;
};

export const useRemoveNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			'useRemoveNotification must be used within a NotificationProvider'
		);
	}

	const removeNotification = () => {
		context.notificationDispatch({
			type: 'REMOVE_NOTIFICATION',
		});
	};

	return removeNotification;
};

export default NotificationContext;
