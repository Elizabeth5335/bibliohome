import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();

    if (searchTerm.trim() === "") {
      setError("Спершу введіть назву або автора!");
    } else if (searchTerm.length < 3) {
      setError("Назва або автор повинні бути довші за 3 символи.");
    } else {
      setError("");
      const sanitizedSearchTerm = encodeURIComponent(searchTerm.trim());
      navigate(`/books/${sanitizedSearchTerm}`);
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
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}
