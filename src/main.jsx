import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {  BlogProvider } from "./context/blog"; // ✅ named import


import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BlogProvider>
    <App />
    </BlogProvider>
  </StrictMode>,
)
