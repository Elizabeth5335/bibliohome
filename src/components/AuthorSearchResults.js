import React from "react";
import BookList from "./BookList";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useBooks } from "../context/BooksContext";

export default function AuthorSearchResults() {
  const [filteredBooks, setFilteredBooks] = React.useState([]);
  const { author } = useParams();
  const { books } = useBooks();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (books) {
      const filtered = Object.values(books).filter((book) => book.author.toLowerCase() === author.toLowerCase());
      setFilteredBooks(filtered);
    }
  }, [books, author]);

  return (
    <div className="search-results outContainer">
      <button
        onClick={() => navigate(-1)}
      >
        Назад
      </button>

      <h2>Книги автора "{author}"</h2>

      {filteredBooks.length > 0 ? (
        <BookList books={filteredBooks} />
      ) : (
        "Немає книг заданого автора"
      )}
    </div>
  );
}
