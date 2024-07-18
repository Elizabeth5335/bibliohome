import { getAuth } from "firebase/auth";
import NoAccessMessage from "./NoAccessMessage";

export default function EditBook() {
  const auth = getAuth();
  const user = auth.currentUser;
  return <>{user ? <div>Edit book</div> : <NoAccessMessage />}</>;
}
