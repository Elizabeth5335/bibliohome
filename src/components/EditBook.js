import React from "react";
import { Link } from "react-router-dom";
import { getDatabase, ref, push, update, get, child } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import NoAccessMessage from "./NoAccessMessage";
import { useBooks } from "../context/BooksContext";
import { db, storage } from "../firebaseConfig";

export default function EditBook() {

  const [bookId, setBookId] = React.useState();
  
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [name, setName] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [id, setId] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [additionalImages, setAdditionalImages] = React.useState([]);
  const [price, setPrice] = React.useState("");
  const [coverImage, setCoverImage] = React.useState(null);

  const { categories, books, updateBooks } = useBooks();
  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const [mergedCats, setMergedCats] = React.useState();

  React.useEffect(() => {
    console.log("categories.adults");
    console.log(categories?.adults);
    if (categories) {
      const adultCats = categories?.adults;
      const childCats = categories?.children;

      setMergedCats({ ...adultCats, ...childCats });
    }
  }, [categories]);

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages([...e.target.files]);
  };

  const uploadImage = async (image) => {
    const imageRef = storageRef(storage, `images/${image?.name}`);
    await uploadBytes(imageRef, image);
    return getDownloadURL(imageRef);
  };

  const checkBookExists = (bookName) => {
    return (
      Object.values(books)?.filter(
        (book) => book?.name?.toLowerCase() === bookName?.toLowerCase()
      ).length !== 0
    );
  };

  function newId(e) {
    const tmp = Object.keys(mergedCats).find(
      (key) => mergedCats[key] === e.target.value
    );
    return tmp ? tmp + "-" + Date.now() : Date.now();
  }

  const addBook = (e) => {
    e.preventDefault();
    if (checkBookExists(name)) {
      window.alert(
        "Книга з такою назвою вже існує. Видаліть/відредагуйте її або зверніться до Лізи, щоб виправити помилку."
      );
      return;
    }
    try {
      const coverImageUrl = uploadImage(coverImage);
      const additionalImagesUrls = Promise.all(
        additionalImages.map((image) => uploadImage(image))
      );

      const newBook = {
        id,
        name,
        author,
        description,
        category,
        url: coverImageUrl,
        additionalImages: additionalImagesUrls,
        price,
      };

      const booksRef = ref(db, `books/${id}`);
      update(booksRef, newBook);
      updateBooks();

      window.alert("Книга додана успішно!");
      setId("");
      setName("");
      setAuthor("");
      setDescription("");
      setCategory("");
      setCoverImage("");
      setAdditionalImages("");
      setPrice("");
    } catch (error) {
      window.alert("Сталася помилка!", error);
    }
  };

  return (
    <div className="add-book">
      <Link
        to={"/admin"}
        style={{ textDecoration: "none", alignSelf: "start" }}
      >
        <button>Назад</button>
      </Link>
      {user ? (
        <div>
          <h2>Редагування книги</h2>

          <>Find the book</>
          <form onSubmit={addBook}>
            <div className="form-field">
              <label>id</label>
              <input
                type="text"
                value={id}
                disabled
                // required
              />
            </div>
            <div className="form-field">
              <label>Назва</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Автор</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Опис</label>
              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Категорія</label>
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  console.log("merged");
                  console.log(mergedCats);
                  setId(newId(e));
                  return setCategory(e.target.value);
                }}
                list="category-options"
                required
              />
              <datalist id="category-options">
                {mergedCats &&
                  Object.entries(mergedCats).map(([cat, val]) => (
                    <option key={cat} value={val}>
                      {mergedCats[cat]}
                    </option>
                  ))}
                {/* {categories &&
                  Object.entries(categories.children).map(([cat, val]) => (
                    <option key={cat} value={cat}>
                      {categories.children[cat]}
                    </option>
                  ))} */}
              </datalist>
            </div>
            <div className="form-field price">
              <label>Вартість прокату</label>
              <div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <span>zł</span>
              </div>
            </div>
            <div className="form-field image">
              <label>Додати обкладинку</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
            </div>
            <div className="form-field images">
              <label>Додаткові зображення</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
              />
            </div>
            <button type="submit">Додати книгу</button>
          </form>
        </div>
      ) : (
        <NoAccessMessage />
      )}
    </div>
  );
}
