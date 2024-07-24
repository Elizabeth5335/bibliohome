import { getAuth } from "firebase/auth";
import NoAccessMessage from "./NoAccessMessage";
import { Link } from "react-router-dom";


export default function DeleteBook() {
  const auth = getAuth();
  const user = auth.currentUser;
  return <>{user ? <div>
    <Link to={"/admin"} style={{ textDecoration: "none", alignSelf: "start" }}>
        <button>Назад</button>
      </Link>
      Delete book</div> : <NoAccessMessage />}</>;
}
