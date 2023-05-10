import ReactDOM from 'react-dom/client';
import App from './App';

import { CounterProvider } from './CounterContext';

ReactDOM.createRoot(document.getElementById('root')).render(
	<CounterProvider>
		<App />
	</CounterProvider>
);
