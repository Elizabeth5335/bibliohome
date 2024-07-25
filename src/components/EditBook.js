import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NoAccessMessage from "./NoAccessMessage";
import { useBooks } from "../context/BooksContext";

export default function EditBook() {
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");

  const [filteredBooks, setFilteredBooks] = React.useState();

  const { books } = useBooks();

  function findBook() {
    if (books) {
      const bookList = Object.values(books) || [];

      if (id) {
        return bookList.filter((book) => book.id.toLowerCase().includes(id.toLowerCase()));
      } else if (name) {
        return bookList.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
      } else {
        return null;
      }
    }
  }

  React.useEffect(() => {
    setFilteredBooks(findBook);
  }, [id, name]);

  const navigate = useNavigate();

  return (
    <div>
      <Link
        to={"/admin"}
        style={{ textDecoration: "none", alignSelf: "start" }}
      >
        <button>Назад</button>
      </Link>
      {user ? (
        <div className="edit">
          <div className="form">
            <h2>Редагування книги</h2>

            <form onSubmit={findBook}>
              <div className="form-field">
                <label>id</label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
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
                      navigate(`/edit/${book.id}`);
                    }}
                  >
                    Редагувати
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
