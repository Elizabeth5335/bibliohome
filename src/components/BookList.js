import React from "react";
import BookCard from "./BookCard";

export default function BookList(props) {
  return (
    <div
      className="bookList"
      style={{ display: "flex", flexWrap: "wrap", maxWidth: "700px", margin: "auto"}}
    >
      {props.books ? (
        props.books.map((book) => {
          return (
            <BookCard
              name={book.name}
              author={book.author}
              price={book.price}
              // url={book.url}
            ></BookCard>
          );
        })
      ) : (
        <p>За вашим запитом немає книг</p>
      )}
    </div>
  );
}
