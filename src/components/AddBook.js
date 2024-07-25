import React from "react";
import { Link } from "react-router-dom";
import { ref, update } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import NoAccessMessage from "./NoAccessMessage";
import { useBooks } from "../context/BooksContext";
import { db, storage } from "../firebaseConfig";

export default function AddBook() {
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [name, setName] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [id, setId] = React.useState(""); // Generate this automatically if needed
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [forAdults, setForAdults] = React.useState(false);
  const [additionalImages, setAdditionalImages] = React.useState([]);
  const [price, setPrice] = React.useState("");
  const [coverImage, setCoverImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const { categories, books } = useBooks();

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const [mergedCats, setMergedCats] = React.useState();

  React.useEffect(() => {
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

  const checkIdExists = (bookId) => {
    return (
      Object.values(books)?.filter(
        (book) => book?.id?.toLowerCase() === bookId?.toLowerCase()
      ).length !== 0
    );
  };

  function newId(e) {
    const tmp = Object.keys(mergedCats).find(
      (key) => mergedCats[key] === e.target.value
    );
    return tmp ? tmp + "-" + Date.now() : Date.now();
  }

  const addBook = async (e) => {
    e.preventDefault();
    if (checkBookExists(name)) {
      window.alert(
        "Книга з такою назвою вже існує. Видаліть/відредагуйте її або зверніться до Лізи, щоб виправити помилку."
      );
      return;
    }
    if (checkIdExists(id)) {
      window.alert(
        "Книга з таким id вже існує. Видаліть її або зверніться до Лізи, щоб виправити помилку."
      );
      return;
    }
    setLoading(true);
    try {
      const coverImageUrl = await uploadImage(coverImage);
      const additionalImagesUrls = await Promise.all(
        additionalImages && additionalImages.map((image) => uploadImage(image))
      );

      const newBook = {
        id,
        name,
        author,
        description,
        category,
        forAdults,
        url: coverImageUrl,
        additionalImages: additionalImagesUrls,
        price,
      };

      const booksRef = ref(db, `books/${id}`);
      await update(booksRef, newBook);

      window.alert("Книга додана успішно!");
      setId("");
      setName("");
      setAuthor("");
      setDescription("");
      setCategory("");
      setCoverImage(null);
      setAdditionalImages([]);
      setPrice("");
      setForAdults(false);
      setLoading(false);
      // Reset file input elements
      document.getElementById("coverImageInput").value = null;
      document.getElementById("additionalImagesInput").value = null;
    } catch (error) {
      console.log("error");
      console.log(error);
      setLoading(false);
      window.alert("Сталася помилка!", error.message);
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
          <h2>Нова книга</h2>
          <form onSubmit={addBook}>
            <div className="form-field">
              <label>id</label>
              <input type="text" value={id} disabled />
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
            <div className="form-field price">
              <label>Книга для дорослих?</label>
              <div>
                <input
                  type="checkbox"
                  checked={forAdults}
                  onChange={(e) => setForAdults(e.target.checked)}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Категорія</label>
              <input
                type="text"
                value={category}
                onChange={(e) => {
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
              </datalist>
            </div>
            <div className="form-field">
              <label>Опис</label>
              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
                id="coverImageInput"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
            </div>
            <div className="form-field images">
              <label>Додаткові зображення</label>
              <input
                id="additionalImagesInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Додається..." : "Додати книгу"}
            </button>
          </form>
        </div>
      ) : (
        <NoAccessMessage />
      )}
    </div>
  );
}
