import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login.jsx';
import Home from './pages/Home.jsx';
import Signup from './components/Signup.jsx';
import EditForm from './components/EditForm.jsx';
import FormSubmitPage from './pages/FormSubmitPage.jsx';
import NotFound from './pages/NotFound.jsx';
import Results from './pages/Results.jsx';
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  }, {
    path: '/',
    element: <Home />
  }, {
    path: "/signup",
    element: <Signup />
  }, {
    path: "form/:formId",
    element: <EditForm />
  },
  {
    path: "submitpage/:formId",
    element: <FormSubmitPage />
  }, {
    path: "results/:formId",
    element: <Results />
  },
  {
    path: "*",  // Catch-all route for undefined paths
    element: <NotFound />  // Display NotFound component for all unknown routes
  }
]);

createRoot(document.getElementById('root')).render(
  <>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />

    <RouterProvider router={router} />
  </>


)
