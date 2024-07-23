import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {

  const [searchTerm, setSearchTerm] = React.useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    window.alert(searchTerm);
  };

  return (
    <section>
      <h2>Шукаєш щось конкретне?</h2>
      <form onSubmit={handleSubmit} className="search-wrapper">
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

      {/* <input onBlur={(e)=>alert(e.target.value)}type="text" placeholder="Введіть назву або автора"></input> */}
      {/* search with tolerance
      https://tomekdev.com/posts/search-with-typo-tolerance
      */}
    </section>
  );
}
