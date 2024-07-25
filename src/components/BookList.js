import React from "react";
import BookCard from "./BookCard";

export default function BookList(props) {
  return (
    <div
      className="bookList"
    >
      {props.books ? (
        props.books.map((book) => {
          return (
            <BookCard
              key={book.id}
              name={book.name}
              author={book.author}
              price={book.price}
              id={book.id}
              url={book.url}
            ></BookCard>
          );
        })
      ) : (
        <p>За вашим запитом немає книг</p>
      )}
    </div>
  );
}
