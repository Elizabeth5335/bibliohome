import './App.css';
import Main from "./components/Main"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <div className="App">
      <Main></Main>
    </div>
  );
}

export default App;
