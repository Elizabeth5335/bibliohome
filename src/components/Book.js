import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";

function ImageModal({ src, alt, onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
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

  const navigate = useNavigate();

  React.useEffect(() => {
    if (books) {
      const foundBook = Object.values(books).find((book) => book.id === bookId);
      setBook(foundBook);
    }
  }, [bookId, books]);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc ||
      "https://timvandevall.com/wp-content/uploads/2014/01/Book-Cover-Template.jpg");
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
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Назад
      </button>
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
          <b>Категорія:</b> {Array.isArray(book.category) ? book.category.join('; ') : book.category}
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
        </div>
      </div>
      {isModalOpen && (
        <ImageModal src={selectedImage} alt="Book Image" onClose={handleCloseModal} />
      )}
    </div>
  );
}
