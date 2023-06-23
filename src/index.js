import React from 'react';

import { createRoot } from 'react-dom/client';
import {
  RouterProvider, createBrowserRouter,
} from 'react-router-dom';
import App from './App';

import DashboardContainer from './containers/DashboardContainer';
import SearchContainer from './containers/SearchContainer';
import ArtistContainer from './containers/ArtistContainer';
import RewindContainer from './containers/RewindContainer';
import FavoritesContainer from './containers/FavoritesContainer';

const container = document.getElementById('app');
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: '/rewind/:userId/:year',
    element: <RewindContainer />,
  },
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
        path: 'favorites',
        element: <FavoritesContainer />,
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
