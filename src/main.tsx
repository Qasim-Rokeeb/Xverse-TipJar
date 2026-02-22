import React from 'react'
import ReactDOM from 'react-dom/client'
import { MidlProvider } from "@midl/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App'
import './index.css'
import { midlConfig } from './midl.config'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MidlProvider config={midlConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MidlProvider>
  </React.StrictMode>,
)
