// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './components/app';
// import * as serviceWorker from './serviceWorker';
// import { DialogsRenderer } from './components/dialog/Dialogs';
// import 'react-tooltip/dist/react-tooltip.css'
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM from 'react-dom/client'
import './index.css';
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import { DialogsRenderer } from './components/dialog/Dialogs';
import 'react-tooltip/dist/react-tooltip.css';

// Get the root element
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  // Render the App
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
