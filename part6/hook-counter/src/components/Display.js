import { useContext } from 'react';
import CounterContext from '../CounterContext';

const Display = () => {
	const { count } = useContext(CounterContext);

	return <div>{count}</div>;
};

export default Display;
