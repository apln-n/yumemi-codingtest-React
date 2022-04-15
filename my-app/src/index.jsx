import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));


const App = () => {
  const myname = "OsakaNaoki";
  const element = <h1>Hello, {myname}.</h1>
  return element;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
