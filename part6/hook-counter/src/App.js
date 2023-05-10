import Button from './components/Button';
import Display from './components/Display';

const App = () => {
	return (
		<div>
			<Display />
			<div>
				<Button type='INCREMENT' label='+' />
				<Button type='DECREMENT' label='-' />
				<Button type='RESET' label='Reset' />
			</div>
		</div>
	);
};

export default App;
