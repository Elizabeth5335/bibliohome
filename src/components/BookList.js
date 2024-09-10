import React, { useState } from "react";
import BookCard from "./BookCard";
import ResponsivePagination from "react-responsive-pagination";

export default function BookList(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;

  const totalPages = Math.ceil(props.books.length / booksPerPage);
  const currentBooks = props.books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <div>
      <div className="bookList">
        {currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <BookCard
              key={book.id}
              name={book.name}
              author={book.author}
              price={book.price}
              id={book.id}
              url={book.url}
            />
          ))
        ) : (
          <p>За вашим запитом немає книг</p>
        )}
      </div>

      <ResponsivePagination
        current={currentPage}
        total={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
