import React from "react";
import { useBooks } from "../context/BooksContext";
import BookCard from "./BookCard";

export default function RandomBook() {
  const { books } = useBooks();
  const [randomBook, setRandomBook] = React.useState(null);

  function generateRND(isForAdults) {
    if (books) {
      // Filter books based on isForAdults
      const filteredBooks = Object.values(books).filter((book) => book.forAdults === isForAdults);

      if (filteredBooks.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredBooks.length);
        setRandomBook(filteredBooks[randomIndex]);
      } else {
        setRandomBook(null);
      }
    }
  }

  return (
    <section>
      <h2>Перевір свою удачу!</h2>
      <p>Випадкова книга</p>
      <button onClick={() => generateRND(true)}>Згенерувати дорослому</button>
      <button onClick={() => generateRND(false)}>Згенерувати дитині</button>
      {randomBook && (

        <div className="random-book">
          <h3>{randomBook.name}</h3>
          <p><b>Автор:</b> {randomBook.author}</p>
          <p><b>Категорія:</b> {Array.isArray(randomBook.category) ? randomBook.category.join('; ') : randomBook.category}</p>
          <p><b>Вартість прокату:</b> {randomBook.price} zł</p>
          {randomBook.url && (
            <img
              className="bookCover"
              src={randomBook.url}
              alt={randomBook.name}
              style={{ maxWidth: "200px", maxHeight: "300px" }}
            />
          )}
        </div>
      )}
    </section>
  );
}
