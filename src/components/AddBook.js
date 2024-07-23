import { getAuth } from "firebase/auth";
import NoAccessMessage from "./NoAccessMessage";
import React from "react";

export default function AddBook() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = React.useState();
  const [author, setAuthor] = React.useState();
  const [id, setId] = React.useState(); //figure out how to automatically do this
  const [category, setCategory] = React.useState(); //dropdown
  const [description, setDescription] = React.useState();
  const [url, setUrl] = React.useState(); //upload image and post to firebase
  const [price, setPrice] = React.useState();

  return (
    <>
      {user ? (
        <div>
          <h2>Add book</h2>
          <form>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div>
              <label>Author</label>
              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <span>zł</span>
            </div>
            <button type="submit">Add book</button>
            {/* {error && <p>{error}</p>} */}
          </form>
        </div>
      ) : (
        <NoAccessMessage />
      )}
    </>
  );
}
