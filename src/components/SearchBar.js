import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useBooks } from "../context/BooksContext";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (searchTerm !== "") {
      navigate(`/books/${searchTerm}`);
    } else {
      alert("Спершу введіть назву або автора!");
    }
  }

  return (
    <section>
      <h2>Шукаєш щось конкретне?</h2>
      <form onSubmit={handleSearch} className="search-wrapper">
        <input
          type="text"
          placeholder="Введіть назву або автора"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </button>
      </form>

    </section>
  );
}
