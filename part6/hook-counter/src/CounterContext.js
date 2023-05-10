import { createContext, useReducer } from 'react';

const CounterContext = createContext();

const counterReducer = (state, action) => {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		case 'DECREMENT':
			return state - 1;
		case 'RESET':
			return 0;
		default:
			return state;
	}
};

export const CounterProvider = ({ children }) => {
	const [count, counterDispatch] = useReducer(counterReducer, 0);

	return (
		<CounterContext.Provider value={{ count, counterDispatch }}>
			{children}
		</CounterContext.Provider>
	);
};

export default CounterContext;
