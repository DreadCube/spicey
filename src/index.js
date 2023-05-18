import React from 'react';

import { createRoot } from 'react-dom/client';
import {
  RouterProvider, createBrowserRouter,
} from 'react-router-dom';
import App from './App';

import DashboardContainer from './containers/DashboardContainer';
import SearchContainer from './containers/SearchContainer';
import ArtistContainer from './containers/ArtistContainer';

const container = document.getElementById('app');
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <DashboardContainer />,
      },
      {
        path: 'search/:search',
        element: <SearchContainer />,
      },
      {
        path: 'artist/:artistId',
        element: <ArtistContainer />,
      },
      {
        path: '*',
        element: <DashboardContainer />,
      },
    ],
  },
]);

root.render(
  <RouterProvider router={router} />,
);
