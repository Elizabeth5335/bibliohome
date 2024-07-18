import React from "react";
import CategoryList from "./CategoryList";
import SearchBar from "./SearchBar";
import RandomBook from "./RandomBook";
import { getDatabase, ref, onValue } from "firebase/database";
import CategorySearchResults from "./CategorySearchResults";

export default function Main() {
  // const [books, setBooks] = React.useState();
  // const db = getDatabase();
  // const booksRef = ref(db, "books");

  // React.useEffect(() => {
  //   onValue(booksRef, (snapshot) => {
  //     const data = snapshot.val();
  //     setBooks(data);
  //   });
  // }, []);

  return (
    <div className="App">
      <h1>Привіт! Вітаю у Bibliohome!</h1>
      <h2>Шукаєш щось конкретне?</h2>
      <SearchBar></SearchBar>
      <h2>або</h2>
      <CategoryList></CategoryList>
      <h2>або</h2>
      <RandomBook></RandomBook>
    </div>
  );
}
