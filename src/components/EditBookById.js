import React from "react";
import { Link, useParams } from "react-router-dom";
import { getDatabase, ref, push, update, remove } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import NoAccessMessage from "./NoAccessMessage";
import { useBooks } from "../context/BooksContext";
import { db, storage } from "../firebaseConfig";
import DeleteBook from "./DeleteBook";

export default function EditBookById() {
  const { categories, books } = useBooks();

  const { bookId } = useParams();

  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  function findBook() {
    if (books) return Object.values(books).find((book) => book.id === bookId);
  }

  const [book, setBook] = React.useState(findBook());

  const [name, setName] = React.useState(book?.name|| "");
  const [id, setId] = React.useState(book?.id);
  const [author, setAuthor] = React.useState(book?.author|| "");
  const [category, setCategory] = React.useState(book?.category|| "");
  const [description, setDescription] = React.useState(book?.description || "");
  const [additionalImages, setAdditionalImages] = React.useState(
    book?.additionalImages || []
  );
  const [price, setPrice] = React.useState(book?.price|| "");
  const [coverImage, setCoverImage] = React.useState(book?.url|| "");
  // const [coverImageURL, setCoverImageURL] = React.useState(book?.url);
  const [loading, setLoading] = React.useState(false);

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

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages([...e.target.files]);
  };

  const uploadImage = async (image) => {
    const imageRef = storageRef(storage, `images/${image?.name}`);
    await uploadBytes(imageRef, image);
    return getDownloadURL(imageRef);
  };

  function newId(e) {
    const tmp = Object.keys(mergedCats).find(
      (key) => mergedCats[key] === e.target.value
    );
    return tmp ? tmp + "-" + Date.now() : Date.now();
  }

  const checkBookExists = (bookName) => {
    return (
      Object.values(books)?.filter(
        (book) => book?.name?.toLowerCase() === bookName?.toLowerCase()
      ).length !== 0
    );
  };

  const editBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const coverImageUrl = await uploadImage(coverImage)
      const additionalImagesUrls = await Promise.all(
        additionalImages && (additionalImages|| []).map((image) => uploadImage(image))
      );

      const updatedBook = {
        id,
        name,
        author,
        description,
        category,
        forAdults: book.forAdults,
        url: coverImageUrl,
        additionalImages: additionalImagesUrls,
        price,
      };

      if (id !== bookId) {
        const bookRef = ref(db, `books/${bookId}`);

        await remove(bookRef);
      }

      const booksRef = ref(db, `books/${id}`);
      await update(booksRef, updatedBook);

      window.alert("Зміни збережені!");
      setLoading(false);
    } catch (error) {
      console.log("error");
      console.log(error);
      setLoading(false);
      window.alert("Сталася помилка!", error.message);
    }
  };

  return (
    <div className="add-book">
      <Link to={"/edit"} style={{ textDecoration: "none", alignSelf: "start" }}>
        <button>Назад</button>
      </Link>
      {user ? (
        <div>
          <form onSubmit={editBook}>
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
              <label>Обкладинка</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
              {/* або URL
              <input
                type="text"
                value={coverImage}
                onChange={(e) => set(e.target.value)}
              /> */}
              {coverImage && (
                <img
                  className="bookCoverDelete"
                  src={book?.url}
                  alt={name}
                />
              )}
            </div>

            <div className="form-field images">
              <label>Додаткові зображення</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
              />
              {book?.additionalImages?.map((image, index) => (
                <img
                  key={`img${index}`}
                  className="bookCoverDelete"
                  src={image}
                  alt={`img${index}`}
                />
              ))}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Оновлюється..." : "Зберегти зміни"}
            </button>
          </form>
        </div>
      ) : (
        <NoAccessMessage />
      )}
    </div>
  );
}
