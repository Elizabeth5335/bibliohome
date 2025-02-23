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
import Book from "./components/Book";
import EditBook from "./components/EditBook";
import DeleteBook from "./components/DeleteBook";
import SearchResults from "./components/SearchResults";
import EditBookById from "./components/EditBookById";
import NewBooks from "./components/NewBooks";
import AuthorSearchResults from "./components/AuthorSearchResults";

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
    path: "/books/author/:author",
    element: <AuthorSearchResults />,
  },

  {
    path: "/books/:searchTerm",
    element: <SearchResults />,
  },
  {
    path: "/books/new",
    element: <NewBooks />,
  },
  {
    path: "/edit/:bookId",
    element: <EditBookById />,
  },
  {
    path: "/book/:bookId",
    element: <Book />,
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
