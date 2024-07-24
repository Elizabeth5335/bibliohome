import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  updatePassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import NoAccessMessage from "./NoAccessMessage";

export default function Admin() {
  const auth = getAuth();

  const [isLoggedIn, setIsLoggedIn] = React.useState();
  const user = auth.currentUser;

  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       const uid = user.uid;
  //       setIsLoggedIn(true);
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   });

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const navigate = useNavigate();

  function resetPassword(e) {
    e.preventDefault();
    sendPasswordResetEmail(auth, user.email)
      .then(() => {
        window.alert("На ваш імейл вислано лист для зміни пароля.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(`Error: ${error.message}`);
      });
  }
  function logOut(e) {
    e.preventDefault();

    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        window.alert(`Error: ${error.message}`);
      });
  }
  return (
    <div id="admin">
      {isLoggedIn ? (
        <div>
          <div>
            <h2>Інструменти бібліотекаря</h2>
            <Link to="/add">
              <button>Додати книгу</button>
            </Link>
            <Link to="/edit">
              <button>Редагувати книгу</button>
            </Link>
            <Link to="/delete">
              <button>Видалити книгу</button>
            </Link>
          </div>
          <div className="bottom-buttons">
            <button onClick={resetPassword}>Змінити пароль</button>
            <button onClick={logOut}>Log out</button>
          </div>
        </div>
      ) : (
        <NoAccessMessage />
      )}
    </div>
  );
}
