import { getAuth } from "firebase/auth";
import NoAccessMessage from "./NoAccessMessage";

export default function DeleteBook() {
  const auth = getAuth();
  const user = auth.currentUser;
  return <>{user ? <div>Delete book</div> : <NoAccessMessage />}</>;
}
