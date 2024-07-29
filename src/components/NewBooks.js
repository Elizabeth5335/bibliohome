import React from "react";
import BookList from "./BookList";
import { Link, useParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";

export default function NewBooks() {
  const [filteredBooks, setFilteredBooks] = React.useState();
  const { age, category } = useParams();
  const { books, categories } = useBooks();

  console.log(categories);

  React.useEffect(() => {
    if (books) {
      const filtered = Object.values(books).filter(
        (book) => book.recentlyAdded === true
      );
      setFilteredBooks(filtered);
    }
  }, [books]);

  return (
    <div className="outContainer">
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <button>На головну</button>
      </Link>

        <h2>Новинки</h2>

      {filteredBooks?.length > 0 ? (
        <BookList books={filteredBooks}></BookList>
      ) : (
        "Немає книг заданої категорії"
      )}
    </div>
  );
}
