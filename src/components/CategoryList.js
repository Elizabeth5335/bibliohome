import React from "react";
import { useBooks } from "../context/BooksContext";
import { Link } from "react-router-dom";

export default function CategoryList(props) {
  const [activeTab, setActiveTab] = React.useState("adult");
  const { categories } = useBooks();

  return (
    <>
      <h2>Пошук за категорією</h2>
      <div>
        <div
          className="tabs"
          style={{ paddingBottom: "1rem", borderBottom: "1px solid grey" }}
        >
          <button
            style={{ marginRight: "3rem", background: "dark-grey" }}
            className={activeTab === "adult" ? "active" : ""}
            onClick={() => setActiveTab("adult")}
          >
            Дорослі
          </button>
          <button
            className={activeTab === "children" ? "active" : ""}
            onClick={() => setActiveTab("children")}
          >
            Діти
          </button>
        </div>
        {categories && (
          <div className="content">
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexWrap: "wrap",
                maxWidth: "700px",
                margin: "1rem auto",
              }}
            >

              {Object.entries(categories[activeTab]).map(([key, category]) => {
                return (
                  <li key={key}>
                    <Link
                      to={`/books/${activeTab}/${key}`}
                      style={{ textDecoration: "none" }}
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
    </>
  );
}
