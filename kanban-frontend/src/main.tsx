import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { TaskWebSocketProvider } from './context/TaskWebSocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TaskWebSocketProvider>
          <App />
        </TaskWebSocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
