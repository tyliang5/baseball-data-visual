import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BaseballDataProvider } from './components/BaseballDataContext';

ReactDOM.render(
  <React.StrictMode>
    <BaseballDataProvider>
      <App />
    </BaseballDataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
