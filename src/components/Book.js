import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";

function ImageModal({ src, alt, onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={src} alt={alt} className="modal-image" />
      </div>
    </div>
  );
}

export default function Book() {
  const { bookId } = useParams();
  const { books } = useBooks();
  const [book, setBook] = React.useState();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState("");
  const [relatedBooks, setRelatedBooks] = React.useState([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (books) {
      const foundBook = Object.values(books).find((book) => book.id === bookId);
      setBook(foundBook);

      if (foundBook?.series) {
        const booksInSeries = Object.values(books).filter(
          (b) => b.series === foundBook.series && b.id !== bookId
        );
        setRelatedBooks(booksInSeries);
      }
    }
  }, [bookId, books]);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(
      imageSrc ||
        "https://timvandevall.com/wp-content/uploads/2014/01/Book-Cover-Template.jpg"
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="outContainer">
      <button onClick={() => navigate(-1)}>Назад</button>
      <div className="bookPage">
        <div>
          <img
            className="bookCoverMain"
            src={
              book.url ||
              "https://timvandevall.com/wp-content/uploads/2014/01/Book-Cover-Template.jpg"
            }
            alt={book.name}
            onClick={() => handleImageClick(book.url)}
          />
        </div>
        <div>
          <h2>{book.name}</h2>
          <p className="importantText">
            <b>Вартість прокату: {book.price} zł</b>
          </p>
          <p className="importantText">
            <b>Автор: </b>
            <Link to={`/books/author/${encodeURIComponent(book.author)}`}>
              {book.author}
            </Link>
          </p>
          {book.description && (
            <p>
              <b>Опис: </b>
              {book.description}
            </p>
          )}
          <p>
            <b>Категорія:</b>{" "}
            {Array.isArray(book.category) ? (
              book.category.map((cat, index) => (
                <span key={index}>
                  {cat}
                  {index < book.category.length - 1 && ", "}
                </span>
              ))
            ) : (
              <Link to={`/books/category/${encodeURIComponent(book.category)}`}>
                {book.category}
              </Link>
            )}
          </p>
          {book?.additionalImages && (
            <div>
              <b>Додаткові зображення</b>
              {book.additionalImages.map((image, index) => (
                <img
                  key={index}
                  className="additional-image"
                  src={image}
                  alt={`${book.name}-${index}`}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          )}

          {relatedBooks.length > 0 && (
            <div className="related-books-section">
              <h3>Інші книги з серії</h3>
              <div className="related-books">
                {relatedBooks.map((relatedBook) => (
                  <div key={relatedBook.id} className="related-book-item">
                    <Link to={`/book/${relatedBook.id}`}>
                      <img
                        src={
                          relatedBook.url ||
                          "https://timvandevall.com/wp-content/uploads/2014/01/Book-Cover-Template.jpg"
                        }
                        alt={relatedBook.name}
                      />
                      <p>{relatedBook.name}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <ImageModal
          src={selectedImage}
          alt="Book Image"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
