import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { NotificationProvider } from './contexts/notificationContext'
import { UserProvider } from './contexts/userContext'

import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </UserProvider>
  </QueryClientProvider>
)
