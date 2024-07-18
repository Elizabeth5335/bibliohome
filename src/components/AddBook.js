import { getAuth } from "firebase/auth";
import NoAccessMessage from "./NoAccessMessage";

export default function AddBook() {
  const auth = getAuth();
  const user = auth.currentUser;
  return <>{user ? <div>Add book</div> : <NoAccessMessage />}</>;
}
