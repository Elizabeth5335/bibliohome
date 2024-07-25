import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Main from "./components/Main";
import CategorySearchResults from "./components/CategorySearchResults";
import { BooksProvider } from "./context/BooksContext";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Admin from "./components/Admin";
import AddBook from "./components/AddBook";
import EditBook from "./components/EditBook";
import DeleteBook from "./components/DeleteBook";
import SearchResults from "./components/SearchResults";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/books/:age/:category",
    element: <CategorySearchResults />,
  },

  {
    path: "/books/:searchTerm",
    element: <SearchResults />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/add",
    element: <AddBook />,
  },
  {
    path: "/edit",
    element: <EditBook />,
  },
  {
    path: "/delete",
    element: <DeleteBook />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BooksProvider>
    <RouterProvider router={router} />
  </BooksProvider>
);
