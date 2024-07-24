import React, { createContext, useContext } from "react";
import { ref, onValue } from "firebase/database";

import { db } from "../firebaseConfig";

const BooksContext = createContext();

export function useBooks() {
  return useContext(BooksContext);
}

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const db = getDatabase();

export function BooksProvider({ children }) {
  const [books, setBooks] = React.useState(null);
  const [categories, setCategories] = React.useState(null);

  const booksRef = ref(db, "books");
  const categoriesRef = ref(db, "categories");

  React.useEffect(() => {
    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      setBooks(data);
    });
  }, []);

  React.useEffect(() => {
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      setCategories(data);
    });
  }, []);

  const updateBooks = () =>{
    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      setBooks(data);
    });
  }
  const values = {
    books,
    categories,
    updateBooks
  };

  return (
    <BooksContext.Provider value={values}>{children}</BooksContext.Provider>
  );
}
