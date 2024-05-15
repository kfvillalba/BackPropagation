import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import { NotFoundPage } from "./pages/NotFoundPage";
import PaginaEntrenamiento from "./pages/PaginaEntrenamiento";
import PaginaSimulacion from "./pages/PaginaSimulacion";
const router = createBrowserRouter([
  {
    path: "/",
    element: <PaginaPrincipal />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/entrenamiento",
    element: <PaginaEntrenamiento />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/simulacion",
    element: <PaginaSimulacion />,
    errorElement: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />,
  </React.StrictMode>
);
