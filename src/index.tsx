import React from 'react';
import ReactDOM from 'react-dom/client';
import { Screen } from './components/screen';
import { WindowsContextProvider } from './contexts';
import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <WindowsContextProvider>
            <Screen />
        </WindowsContextProvider>
  </React.StrictMode>
);
