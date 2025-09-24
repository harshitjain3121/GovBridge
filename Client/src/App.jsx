import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './RootLayout';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import IssuePage from './pages/IssuePage';
import CreateIssue from './pages/CreateIssue';
import Dashboard from './pages/Dashboard';
import ClientLogin from './pages/ClientLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Notifications from './pages/Notifications';
import RequireRole from './components/RequireRole';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'issues/:id', element: <IssuePage /> },
      { path: 'create-issue', element: <CreateIssue /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'dashboard', element: (
          <RequireRole role="government">
            <Dashboard />
          </RequireRole>
        ) 
      },
    ],
  },
  { path: '/login', element: <ClientLogin /> },
  { path: '/admin-login', element: <AdminLogin /> },
  { path: '/register', element: <Register /> },
  { path: '/logout', element: <Logout /> },
]);

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
