import React from "react";

export default function SearchBar() {
  return (
      <>
      <h2>Пошук за назвою або автором</h2> 
      <input onBlur={(e)=>alert(e.target.value)}type="text" placeholder="Введіть назву або автора"></input>
      {/* search with tolerance
      https://tomekdev.com/posts/search-with-typo-tolerance
      */}
      </>
  );
}
