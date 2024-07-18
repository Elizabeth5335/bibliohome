import React from "react";
import BookList from "./BookList";
import SearchBar from "./SearchBar";

export default function CategorySearchResults(props) {
  const [filteredBooks, setFilteredBooks] = React.useState();

  React.useEffect(() => {
      const filtered = props.books.children.children05;
      setFilteredBooks(filtered);
  }, []);

  return (
    <>
    <button>На головну</button>
      {/* <SearchBar></SearchBar> */}
      {filteredBooks && <BookList books={filteredBooks}></BookList>}
    </>
  );
}
