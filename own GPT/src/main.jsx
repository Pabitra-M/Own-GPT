import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Homepage from './route/homepage/Homepage.jsx';
import Dashbord from './route/dashbord/Dashbord.jsx';
import Chatpage from './route/chatpage/Chatpage.jsx';
import RootLayout from './layout/rootLayout/RootLayout.jsx';
import DashbordLayout from './layout/dashbordLayout/DashbordLayout.jsx';
import SigninPage from './route/signinPage/SigninPage.jsx';
import SignupPage from './route/signupPage/SignupPage.jsx';







const router = createBrowserRouter([
{ element: <RootLayout />, 
  children: [
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/sign-in/*",
      element: <SigninPage />,
    },
    {
      path: "/sign-up/*",
      element: <SignupPage />,
    },
    {
      element: <DashbordLayout />,
      
      children: [{path: "/dashbord", element: <Dashbord />},{
        path : "/dashbord/chats/:id", element: <Chatpage />
     } ]
    },
  ]
}, 
]);













ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
