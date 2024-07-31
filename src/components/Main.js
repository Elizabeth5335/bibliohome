import React from "react";
import CategoryList from "./CategoryList";
import SearchBar from "./SearchBar";
import RandomBook from "./RandomBook";
import BiblioHome from "../assets/BiblioHome.png"
import NewBooks from "./NewBooks";
import { Link } from "react-router-dom";

export default function Main() {
  return (
    <div className="App">
      {/* <h1 id="main-heading">Привіт! Вітаю у Bibliohome!</h1> */}
      <img src={BiblioHome} alt="" className="logo"/>
      <p className="main-text">Українська бібліотека в Лодзі</p>
      <SearchBar></SearchBar>
      {/* <h2>або</h2> */}
      <CategoryList></CategoryList>
      <section>
        <Link to="books/new"><h2 className="recently-text">НОВИНКИ</h2></Link>
      </section>
      {/* <h2>або</h2> */}
      <RandomBook></RandomBook>
    </div>
  );
}
