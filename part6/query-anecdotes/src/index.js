import React from 'react';
import ReactDOM from 'react-dom/client';

import { NotificationProvider } from './contexts/notificationContext';

import App from './App';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
	<QueryClientProvider client={queryClient}>
		<NotificationProvider>
			<App />
		</NotificationProvider>
	</QueryClientProvider>
);
