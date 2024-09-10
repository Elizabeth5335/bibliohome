import React from "react";
import BookList from "./BookList";
import { Link, useParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";
import SearchBar from "./SearchBar";

export default function SearchResults(props) {
  const [filteredBooks, setFilteredBooks] = React.useState([]);
  const [exactFilteredBooks, setExactFilteredBooks] = React.useState([]);
  const { searchTerm } = useParams();
  const { books } = useBooks();

  const MIN_DISTANCE = 3;

  const normalizeString = (str) => {
    if (!str) return "";
    return str.toLowerCase().replace(/[^a-zа-яієґ0-9\s]/gi, "").trim();
  };

  const splitIntoWords = (str) => normalizeString(str).split(/\s+/);

  const levenshtein = (s, t) => {
    if (!s.length || (!s && t)) return t.length;
    if (!t.length || (!t && s)) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
      arr[i] = [i];
      for (let j = 1; j <= s.length; j++) {
        arr[i][j] =
          i === 0
            ? j
            : Math.min(
                arr[i - 1][j] + 1,
                arr[i][j - 1] + 1,
                arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
              );
      }
    }
    return arr[t.length][s.length];
  };

  React.useEffect(() => {
    if (books) {
      const searchLower = normalizeString(searchTerm);

      // Filter for exact matches
      let nameFilteredExact = Object.values(books).filter((book) => {
        const normalizedBookName = normalizeString(book.name);
        return normalizedBookName.includes(searchLower);
      });

      // Filter for approximate matches
      const searchWords = splitIntoWords(searchLower);

      let nameFiltered = Object.values(books).filter((book) => {
        const bookNameWords = splitIntoWords(book.name);
        return bookNameWords.some((word) => {
          return searchWords.some((searchWord) => {
            const distance = levenshtein(word, searchWord);
            return distance <= MIN_DISTANCE;
          });
        });
      });

      let authorFilteredExact = Object.values(books).filter((book) => {
        return normalizeString(book.author).includes(searchLower);
      });

      let authorFiltered = Object.values(books).filter((book) => {
        const authorNameWords = splitIntoWords(book.author);
        return authorNameWords.some((word) => {
          return searchWords.some((searchWord) => {
            const distance = levenshtein(word, searchWord);
            return distance <= MIN_DISTANCE;
          });
        });
      });

      const combinedFilter = [...nameFiltered, ...authorFiltered];
      const uniqueBooks = Array.from(
        new Set(combinedFilter.map((book) => book.id))
      ).map((id) => combinedFilter.find((book) => book.id === id));

      const combinedExact = [...nameFilteredExact, ...authorFilteredExact];
      const uniqueExact = Array.from(
        new Set(combinedExact.map((book) => book.id))
      ).map((id) => combinedExact.find((book) => book.id === id));

      setFilteredBooks(uniqueBooks);
      setExactFilteredBooks(uniqueExact);
    }
  }, [searchTerm, books]);

  return (
    <div className="search-results outContainer">
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <button>На головну</button>
      </Link>

      <SearchBar />
      {searchTerm && <h2>Книги за запитом "{searchTerm}"</h2>}

      {exactFilteredBooks?.length > 0 && (
        <BookList books={exactFilteredBooks}></BookList>
      )}

      {filteredBooks?.length > 0 && (
        <>
          <div>
            <h2>Можливо ви шукали</h2>
          </div>
          <BookList books={filteredBooks}></BookList>
        </>
      )}

      {filteredBooks?.length === 0 && exactFilteredBooks?.length === 0 && (
        <p>За вашим запитом не знайдено книг</p>
      )}
    </div>
  );
}
