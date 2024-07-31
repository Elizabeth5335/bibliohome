import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, update, remove } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import NoAccessMessage from "./NoAccessMessage";
import { useBooks } from "../context/BooksContext";
import { db, storage } from "../firebaseConfig";

export default function EditBookById() {
  const { categories, books } = useBooks();
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [book, setBook] = React.useState(null);
  const [name, setName] = React.useState("");
  const [id, setId] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [additionalCategories, setAdditionalCategories] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [coverImage, setCoverImage] = React.useState(null);
  const [coverURL, setCoverURL] = React.useState("");
  const [additionalImages, setAdditionalImages] = React.useState([]);
  const [additionalImageURLs, setAdditionalImageURLs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [mergedCats, setMergedCats] = React.useState([]);

  React.useEffect(() => {
    if (categories) {
      const merged = [
        ...categories.adults.map(cat => ({ catId: cat.catId, name: cat.name })),
        ...categories.children.map(cat => ({ catId: cat.catId, name: cat.name })),
      ];
            
      setMergedCats(merged);
      console.log("merged");
      console.log(merged);
    }
  }, [categories]);

  React.useEffect(() => {
    if (books && bookId) {
      const bookToEdit = books[bookId];
      if (bookToEdit) {
        setBook(bookToEdit);
        setName(bookToEdit?.name);
        setId(bookToEdit?.id);
        setAuthor(bookToEdit?.author);
        setCategory(
          Array.isArray(bookToEdit?.category)
            ? bookToEdit.category[0]
            : bookToEdit.category
        );
        setAdditionalCategories(
          Array.isArray(bookToEdit?.category) ? bookToEdit?.category.slice(1) : []
        );
        setDescription(bookToEdit?.description);
        setPrice(bookToEdit?.price);
        setCoverURL(bookToEdit?.url);
      }
    }
  }, [books, bookId]);

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

  const newId = (categoryName) => {
    const timestamp = Date.now().toString().slice(-6);
    
    const foundCat = mergedCats.find(cat => cat.name === categoryName);
    
    return foundCat ? `${foundCat.catId}-${timestamp}`.slice(0, 9) : timestamp;
  };
  
  
  

  const deleteImage = (index) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const deleteExistingImage = (index) => {
    const updatedImages = book.additionalImages.filter((_, i) => i !== index);
    setBook({ ...book, additionalImages: updatedImages });
  };

  const editBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let coverImageUrl = coverURL;

      if (coverImage) {
        coverImageUrl = await uploadImage(coverImage);
      }

      const additionalImagesUrls = await Promise.all(
        additionalImages.map((image) => uploadImage(image))
      );

      const updatedBook = {
        id,
        name,
        author,
        description,
        category: [category, ...additionalCategories],
        forAdults: book.forAdults,
        url: coverImageUrl,
        additionalImages: [
          ...(book.additionalImages || []),
          ...additionalImagesUrls,
          ...additionalImageURLs,
        ],
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
      navigate("/edit");
    } catch (error) {
      console.error("error", error);
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
                  setId(newId(e.target.value));
                  setCategory(e.target.value);
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
                value={additionalCategories.join(", ")}
                onChange={(e) =>
                  setAdditionalCategories(
                    e.target.value.split(",").map((cat) => cat.trim())
                  )
                }
                placeholder="введіть додаткові категорії через кому"
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
              <label>Обкладинка</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
              або URL
              <input
                type="text"
                value={coverURL}
                placeholder="вставте посилання на зображення"
                onChange={(e) => {
                  setCoverImage(null);
                  setCoverURL(e.target.value);
                }}
              />
              {coverImage && (
                <img
                  className="bookCoverDelete"
                  src={URL.createObjectURL(coverImage)}
                  alt={name}
                />
              )}
              {!coverImage && coverURL && (
                <img className="bookCoverDelete" src={coverURL} alt={name} />
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
              {additionalImages.map((image, index) => (
                <div key={`new-img${index}`} className="image-wrapper">
                  <img
                    className="bookCoverDelete"
                    src={URL.createObjectURL(image)}
                    alt={`new-img${index}`}
                  />
                  <button type="button" onClick={() => deleteImage(index)}>
                    Видалити
                  </button>
                </div>
              ))}
              {additionalImageURLs.map((url, index) => (
                <div key={`new-url${index}`} className="image-wrapper">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) =>
                      handleAdditionalImageURLChange(index, e.target.value)
                    }
                    placeholder="вставте посилання на зображення"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImageURLField(index)}
                  >
                    Видалити
                  </button>
                </div>
              ))}
              <button type="button" onClick={addAdditionalImageURLField}>
                Додати посилання на зображення
              </button>
              {book?.additionalImages?.map((image, index) => (
                <div key={`existing-img${index}`} className="image-wrapper">
                  <img
                    className="bookCoverDelete"
                    src={image}
                    alt={`existing-img${index}`}
                  />
                  <button
                    type="button"
                    onClick={() => deleteExistingImage(index)}
                  >
                    Видалити
                  </button>
                </div>
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
