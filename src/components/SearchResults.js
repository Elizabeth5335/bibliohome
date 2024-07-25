import React from "react";
import BookList from "./BookList";
import { Link, useParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";
import SearchBar from "./SearchBar";

export default function SearchResults(props) {
  const [filteredBooks, setFilteredBooks] = React.useState();
  const [exactFilteredBooks, setExactFilteredBooks] = React.useState();
  const { searchTerm } = useParams();
  const { books } = useBooks();

  //   if (!books) {
  //     books = JSON.parse(localStorage.getItem("books"));
  //   }

  const MIN_DISTANCE = 3;

  React.useEffect(() => {
    if (books) {
      const searchLower = searchTerm?.toLowerCase();

      let nameFilteredExact = Object.values(books).filter((book) => {
        return book.name?.toLowerCase().includes(searchLower);
      });

      let nameFiltered = [];
      nameFiltered = Object.values(books).filter((book) => {
        const nameParts = book.name?.toLowerCase().split(" ");
        let flag = false;
        nameParts?.map((part) => {
          const distance = levenshtein(part, searchLower);
          if (distance <= MIN_DISTANCE) flag = true;
        });
        return flag;
      });

      let authorFilteredExact = Object.values(books).filter((book) => {
        return book.author?.toLowerCase().includes(searchLower);
      });

      let authorFiltered = [];
      authorFiltered = Object.values(books).filter((book) => {
        let flag = false;

        const splitAuthor = book.author?.toLowerCase().split(" ");
        splitAuthor?.map((name) => {
          const distance = levenshtein(name, searchLower);
          if (distance <= MIN_DISTANCE) flag = true;
        });
        return flag;
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
  }, [searchTerm]);

  const levenshtein = (s, t) => {
    if (!s.length || (!s && t)) return t.length;
    if (!t.length || (!t && s)) return s.length;
    if (!t && !s) return 999;
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

  return (
    <div className="search-results">
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

      {filteredBooks?.length < 0 &&
        exactFilteredBooks?.length < 0("За вашим запитом не знайдено книг")}
    </div>
  );
}
