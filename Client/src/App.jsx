import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './RootLayout'; // updated import
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import IssuePage from './pages/IssuePage';
import CreateIssue from './pages/CreateIssue';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'issues/:id', element: <IssuePage /> },
      { path: 'create-issue', element: <CreateIssue /> },
      { path: 'dashboard', element: <Dashboard /> },
    ],
  },
  { 
    path: '/login', 
    element: <Login /> 
  },
  { 
    path: '/register', 
    element: <Register /> 
  },
  { 
    path: '/logout', 
    element: <Logout /> 
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
