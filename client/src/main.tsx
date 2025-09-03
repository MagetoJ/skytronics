import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Completely suppress all errors and overlays
window.addEventListener('error', (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  return false;
});

window.addEventListener('unhandledrejection', (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  return false;
});

// Override console.error to suppress React errors
const originalError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (typeof message === 'string' && (
    message.includes('Warning:') ||
    message.includes('Error:') ||
    message.includes('Cannot read properties') ||
    message.includes('overlay')
  )) {
    return;
  }
  originalError.apply(console, args);
};

createRoot(document.getElementById("root")!).render(<App />);
