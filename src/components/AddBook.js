import React from "react";
import { Link } from "react-router-dom";
import { ref, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import NoAccessMessage from "./NoAccessMessage";
import { useBooks } from "../context/BooksContext";
import { db, storage } from "../firebaseConfig";

export default function AddBook() {
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [name, setName] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [id, setId] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [additionalCategories, setAdditionalCategories] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [forAdults, setForAdults] = React.useState(false);
  const [price, setPrice] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [coverImage, setCoverImage] = React.useState(null);
  const [coverURL, setCoverURL] = React.useState("");
  const [additionalImages, setAdditionalImages] = React.useState([]);
  const [additionalImageURLs, setAdditionalImageURLs] = React.useState([]);
  
  const [series, setSeries] = React.useState(""); // New state for book series

  const { categories, books } = useBooks();
  const [mergedCats, setMergedCats] = React.useState([]);

  React.useEffect(() => {
    if (categories) {
        const merged = [
          ...categories.adults.map(cat => ({ catId: cat.catId, name: cat.name })),
          ...categories.children.map(cat => ({ catId: cat.catId, name: cat.name })),
        ];   
        setMergedCats(merged);
    }
  }, [categories]);

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
    setCoverURL("");
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalImages([...e.target.files]);
  };

  const handleAdditionalImageURLChange = (index, value) => {
    const newURLs = [...additionalImageURLs];
    newURLs[index] = value;
    setAdditionalImageURLs(newURLs);
  };

  const addAdditionalImageURLField = () => {
    setAdditionalImageURLs([...additionalImageURLs, ""]);
  };

  const removeAdditionalImageURLField = (index) => {
    const newURLs = additionalImageURLs.filter((_, i) => i !== index);
    setAdditionalImageURLs(newURLs);
  };

  const uploadImage = async (image) => {
    const imageRef = storageRef(storage, `images/${image.name}`);
    await uploadBytes(imageRef, image);
    return getDownloadURL(imageRef);
  };

  const deleteImage = (index) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
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
    const timestamp = Date.now().toString().slice(-6);
    const foundCat = mergedCats.find(cat => cat.name === e.target.value);
    return foundCat ? `${foundCat.catId}-${timestamp}`.slice(0, 9) : timestamp;
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
      const coverImageUrl = coverImage
        ? await uploadImage(coverImage)
        : coverURL;

      const additionalImagesUrls = await Promise.all(
        additionalImages.map((image) => uploadImage(image))
      );

      const newBook = {
        id,
        name,
        author,
        description,
        category: [category, ...additionalCategories],
        forAdults,
        series,  // Add series to the newBook object
        url: coverImageUrl,
        additionalImages: [...additionalImagesUrls, ...additionalImageURLs],
        price,
        recentlyAdded: true,
        addDate: new Date().toISOString()
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
      setCoverURL("");
      setAdditionalImageURLs([]);
      setSeries("");  // Reset series field

      const coverInput = document.getElementById("coverImageInput");
      const additionalInput = document.getElementById("additionalImagesInput");

      if (coverInput) {
        coverInput.value = null;
      }
      if (additionalInput) {
        additionalInput.value = null;
      }
    } catch (error) {
      console.log("error");
      console.log(error);
      setLoading(false);
      window.alert("Сталася помилка!", error.message);
    }
  };

  return (
    <div className="add-book">
      <Link to={"/admin"} style={{ textDecoration: "none", alignSelf: "start" }}>
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
            <div className="form-field">
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
                {mergedCats.map((cat) => (
                  <option key={cat.catId} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </datalist>
            </div>

            <div className="form-field">
              <label>Додаткові категорії</label>
              <input
                type="text"
                onChange={(e) => {
                  const categories = e.target.value.split(',').map(cat => cat.trim());
                  setAdditionalCategories(categories);
                }}
                placeholder="введіть додаткові категорії через кому"
              />
            </div>

            <div className="form-field">
              <label>Серія книги</label>  {/* New input field for series */}
              <input
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder="введіть серію книги (якщо є)"
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
            <div className="form-field price">
              <label>Ціна</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
              />
            </div>
            <div className="form-field">
              <label>Обкладинка</label>
              <input
                type="file"
                id="coverImageInput"
                onChange={handleCoverImageChange}
              />
              <input
                type="url"
                placeholder="або введіть URL обкладинки"
                value={coverURL}
                onChange={(e) => setCoverURL(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Додаткові зображення</label>
              <input
                type="file"
                id="additionalImagesInput"
                onChange={handleAdditionalImagesChange}
                multiple
              />
            </div>

            <div className="form-field">
              <label>Додаткові URL зображень</label>
              {additionalImageURLs.map((url, index) => (
                <div key={index} style={{ display: "flex" }}>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleAdditionalImageURLChange(index, e.target.value)}
                  />
                  <button type="button" onClick={() => removeAdditionalImageURLField(index)}>
                    Видалити
                  </button>
                </div>
              ))}
              <button type="button" onClick={addAdditionalImageURLField}>
                Додати поле для URL зображення
              </button>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Завантаження..." : "Додати книгу"}
            </button>
          </form>
        </div>
      ) : (
        <NoAccessMessage />
      )}
    </div>
  );
}
