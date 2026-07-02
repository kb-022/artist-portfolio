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
import Traditional from "./pages/Traditional.tsx";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import Work from "./pages/Work.tsx";
import Digital from "./pages/Digital.tsx";
import Collection from "./pages/Collection.tsx";
import Login from "./pages/Login.tsx";
import Admin from "./pages/Admin.tsx";
import ProtectedLayout from "./components/ProtectedLayout.tsx";

const queryClient = new QueryClient();


const router = createBrowserRouter([
    {path: RouterPath.HOME, element: <App/>,
        children: [
            {index: true, element: <Home/>},
            {path:RouterPath.ABOUT, element: <About/> },
            {path:RouterPath.CONTACT, element: <Contact/> },
            {path:RouterPath.STAR, element: <NotFound/> },
            {path:RouterPath.TRADITIONAL, element: <Traditional/> },
            {path:RouterPath.DIGITAL, element:<Digital/>},
            {path:`${RouterPath.WORKS}/:slug`, element:<Work/>},
            {path: `${RouterPath.COLLECTIONS}/:slug`, element:<Collection/>},
            {
                element: <ProtectedLayout/>,
                children: [
                    {path: `${RouterPath.LOGIN}`, element:<Login/>},
                    {path: `${RouterPath.ADMIN}`, element:<Admin/>},
                ]
            }
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
    <RouterProvider router = {router} />
      </QueryClientProvider>
  </StrictMode>,
)
