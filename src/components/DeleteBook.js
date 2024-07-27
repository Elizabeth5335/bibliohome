import React from "react";
import { Link } from "react-router-dom";
import { ref, remove, update } from "firebase/database";
import NoAccessMessage from "./NoAccessMessage";
import { useBooks } from "../context/BooksContext";
import { db, storage } from "../firebaseConfig";
import { getAuth } from "firebase/auth";

export default function DeleteBook() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { books } = useBooks();

  const [bookId, setBookId] = React.useState("");
  const [name, setName] = React.useState("");
  const [filteredBooks, setFilteredBooks] = React.useState();
  const [loading, setLoading] = React.useState(false);

  function findBook() {
    if (books) {
      const bookList = Object.values(books) || [];

      if (bookId) {
        return bookList.filter((book) => book.id?.toLowerCase().includes(bookId.toLowerCase()));
      } else if (name) {
        return bookList.filter((book) => book.name?.toLowerCase().includes(name.toLowerCase()));
      } else {
        return null;
      }
    }
  }

  React.useEffect(() => {
    setFilteredBooks(findBook);
  }, [bookId, name]);

 const deleteBook = async (idToDelete) => {
    setLoading(true);
    try {
      const bookRef = ref(db, `books/${idToDelete}`);

      await remove(bookRef);

      window.alert("Book deleted successfully");
      setName("");
      setBookId("");
      setLoading(false);
    } catch (error) {
      window.alert("Error deleting book:", error);
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="outContainer">
      <Link
        to={"/admin"}
        style={{ textDecoration: "none", alignSelf: "start" }}
      >
        <button>Назад</button>
      </Link>
      {user ? (
        <div className="delete">
          <div className="form">
            <h2>Видалити книгу</h2>
            <form onSubmit={findBook}>
              <div className="form-field">
                <label>id</label>
                <input
                  type="text"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Назва</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button type="submit">Знайти книгу</button>
            </form>
          </div>
          {filteredBooks?.length > 0 ? (
            <div className="results">
              <h3>Знайдено книги:</h3>
              {filteredBooks.map((book) => (
                <div className="bookContainer" key={book.id}>
                  <p>
                    <b>Id: </b> {book.id}
                  </p>
                  <p>
                    <b>Назва: </b> {book.name}
                  </p>
                  <p>
                    <b>Автор: </b> {book.author}
                  </p>
                  <p>
                    <b>Категорія: </b> {book.category}
                  </p>
                  <p>
                    <b>Опис: </b> {book.description}
                  </p>
                  <p>
                    <b>Вартість прокату: </b>
                    {book.price} zł
                  </p>
                  {book.url && (
                    <img
                      className="bookCoverDelete"
                      src={book.url}
                      alt={book.name}
                    />
                  )}
                  <br />
                  <button
                    onClick={() => {
                      deleteBook(book.id);
                    }}
                    disabled={loading}
                  >
                    {loading ? "Видаляється..." : "Видалити"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <h2>Книг не знайдено</h2>
          )}
        </div>
      ) : (
        <NoAccessMessage />
      )}
    </div>
  );
}
