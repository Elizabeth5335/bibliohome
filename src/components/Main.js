import React from "react";
import CategoryList from "./CategoryList";
import SearchBar from "./SearchBar";
import RandomBook from "./RandomBook";

export default function Main() {
  return (
    <>
      <h1>Привіт! Вітаю у Bibliohome!</h1>
      <h2>Шукаєш щось конкретне?</h2>
      <SearchBar></SearchBar>
      <h2>або</h2>
      <CategoryList></CategoryList>
      <h2>або</h2>
      <RandomBook></RandomBook>
    </>
  );
}
