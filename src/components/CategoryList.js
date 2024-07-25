import React from "react";
import { useBooks } from "../context/BooksContext";
import { Link } from "react-router-dom";

export default function CategoryList(props) {
  const [activeTab, setActiveTab] = React.useState(JSON.parse(localStorage.getItem("activeTab"))||"adults");
  const { categories } = useBooks();

  return (
    <section>
      <h2>Пошук за категорією</h2>
      <div>
        <div className="tabs">
          <button
            className={activeTab === "adults" ? "active" : ""}
            onClick={() => {
              localStorage.setItem('activeTab', JSON.stringify("adults"));
              return setActiveTab("adults")}}
          >
            Дорослі
          </button>
          <button
            className={activeTab === "children" ? "active" : ""}
            onClick={() => {
              localStorage.setItem('activeTab', JSON.stringify("children"));
              return setActiveTab("children")}}
          >
            Діти
          </button>
        </div>
        {categories && (
          <div className="content">
            <ul>
              {Object.entries(categories[activeTab]).map(([key, category]) => {
                return (
                  <li key={key}>
                    <Link
                      to={`/books/${activeTab}/${key}`}
                    >
                      <button>{category}</button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
