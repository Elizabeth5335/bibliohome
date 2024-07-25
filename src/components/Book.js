import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";

export default function Book() {
  const { bookId } = useParams();
  const { books } = useBooks();
  const [book, setBook] = React.useState();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (books) {
      const foundBook = Object.values(books).find((book) => book.id === bookId);
      setBook(foundBook);
    }
  }, [bookId, books]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="outContainer">
      {/* <Link to={"/"} style={{ textDecoration: "none" }}> */}
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Назад
      </button>
      {/* </Link> */}
      <div className="bookPage">
        <div>
          <img
            className="bookCoverMain"
            src={
              book.url ||
              "https://timvandevall.com/wp-content/uploads/2014/01/Book-Cover-Template.jpg"
            }
            alt={book.name}
          />
        </div>
        <div>
          <h2>{book.name}</h2>
          <p>
            <b>Вартість прокату:</b> {book.price} zł
          </p>
          <p>
            <b>Автор:</b> {book.author}
          </p>
          {book.description && (
            <p>
              <b>Опис:</b>
              {book.description}
            </p>
          )}
          <p>
            <b>Категорія:</b> {book.category}
          </p>
          {book?.additionalImages && (
            <div>
              <b>More images</b>
              {book.additionalImages.map((image, index) => (
                <img
                  className="additional-image"
                  src={image}
                  alt={`${book.name}-${index}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
