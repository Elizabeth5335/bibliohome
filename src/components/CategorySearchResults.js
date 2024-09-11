import React from "react";
import BookList from "./BookList";
import { Link, useParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";

export default function CategorySearchResults() {
  const [filteredBooks, setFilteredBooks] = React.useState([]);
  const { age, category } = useParams();
  const { books, categories } = useBooks();

  React.useEffect(() => {
    if (books && categories) {
      const selectedCategory = categories[age]?.find(
        (cat) => cat.catId.toLowerCase() === category.toLowerCase()
      )?.name.toLowerCase();

      if (selectedCategory) {
        const filtered = Object.values(books).filter((book) => {
          if (Array.isArray(book.category)) {
            return book.category.some((cat) =>
              selectedCategory.includes(cat.toLowerCase())
            );
          } else {
            return selectedCategory.includes(book.category?.toLowerCase());
          }
        });
        setFilteredBooks(filtered);
      } else {
        setFilteredBooks([]);
      }
    }
  }, [books, categories, age, category]);

  return (
    <div className="search-results outContainer">
      <Link to="/" style={{ textDecoration: "none" }}>
        <button>На головну</button>
      </Link>

      {categories && categories[age] && (
        <h2>Книги категорії "{categories[age].find((cat) => cat.catId.toLowerCase() === category.toLowerCase())?.name}"</h2>
      )}

      {categories && categories[age] && categories[age].find((cat) => cat.catId=="X") && (
        <strong>Книги бонусної категорії можна брати напрокат безкоштовно, додатково до основного замовлення.</strong>
      )}

      {filteredBooks.length > 0 ? (
        <BookList books={filteredBooks} />
      ) : (
        "Немає книг заданої категорії"
      )}
    </div>
  );
}
