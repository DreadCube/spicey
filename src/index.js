import React from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Preloader from './components/Preloader';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Preloader>
      <App />
    </Preloader>
  </BrowserRouter>,
);
