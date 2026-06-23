import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import {RouterPath} from "./enums/RouterPath.ts";
import App from "./App.tsx";

const router = createBrowserRouter([
    {path: RouterPath.HOME, element: <App/>,
        children: [
            {index: true, element: <Home/>},
            {path:RouterPath.ABOUT, element: <About/> },
            {path:RouterPath.CONTACT, element: <Contact/> },
            {path:RouterPath.NOTFOUND, element: <NotFound/> },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
