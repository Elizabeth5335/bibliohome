import React from "react";
import CategoryList from "./CategoryList";
import SearchBar from "./SearchBar";
import RandomBook from "./RandomBook";
import { getDatabase, ref, onValue } from "firebase/database";

export default function Main() {
  const [books, setBooks] = React.useState();
  const db = getDatabase();
  const booksRef = ref(db, "books");
  console.log(booksRef);
  // const [childrenCategories, setChildrenCategories] = React.useState();
  // const [adultCategories, setAdultCategories] = React.useState();

  React.useEffect(() => {
    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      setBooks(data);
    });
  }, []);

  return (
    <>
      <h1>Привіт! Вітаю у Bibliohome!</h1>
      <h2>Шукаєш щось конкретне?</h2>
      {/* {      console.log(books)} */}
      <SearchBar></SearchBar>
      <h2>або</h2>
      <CategoryList
      books={books}
        childrenCategories={Object.keys(books?.children || [])}
        adultCategories={Object.keys(books?.adults || [])}
      ></CategoryList>
      <h2>або</h2>
      <RandomBook></RandomBook>
    </>
  );
}
