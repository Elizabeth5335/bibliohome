// import React from "react";
// import CategoryList from "./CategoryList";
// import SearchBar from "./SearchBar";
// import RandomBook from "./RandomBook";
// import { getDatabase, ref, onValue } from "firebase/database";
// import CategorySearchResults from "./CategorySearchResults";

// export default function Login() {

//   return (
//     <div className="App">
//       <h1>Вітаю, Валеріє</h1>
//       <h2>Підтвердіть свою особистість</h2>

//     </div>
//   );
// }

// Login.js

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { redirect, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  function handleLogin(e) {

    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user) {
          navigate("/admin");
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });
  }
  // e.preventDefault();
  // try {
  //   await signInWithEmailAndPassword(auth, email, password);
  //   await signInWith(auth, email, password);
  //   window.alert("success");
  //   return redirect("/admin");
  // } catch (error) {
  //   setError(error.message);
  // }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
