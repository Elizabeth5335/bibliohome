import React from "react";
import BookList from "./BookList";
import { Link, useParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";

export default function CategorySearchResults(props) {
  const [filteredBooks, setFilteredBooks] = React.useState();
  const { age, category } = useParams();
  const { books, categories } = useBooks();

  console.log(categories);

  React.useEffect(() => {
    if (books) {
      const filtered = Object.values(books).filter(
        (book) => {
          if (Array.isArray(book?.category)) {
            return book?.category?.map((cat) =>
              categories[age][category]?.toLowerCase().includes(cat?.toLowerCase())
            );
          }
          else return categories[age][category]?.toLowerCase()?.includes(book?.category?.toLowerCase())
        }
      );
      setFilteredBooks(filtered);
    }
  }, []);

  return (
    <div className="search-results outContainer">
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <button>На головну</button>
      </Link>

      {categories && categories[age] && (
        <h2>Книги категорії "{categories[age][category]}"</h2>
      )}

      {filteredBooks?.length > 0 ? (
        <BookList books={filteredBooks}></BookList>
      ) : (
        "Немає книг заданої категорії"
      )}
    </div>
  );
}
