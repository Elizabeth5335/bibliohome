import React from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../context/BooksContext";
// import { categoriestmp } from "./categoriestmp";

export default function CategoryList(props) {
  const [activeTab, setActiveTab] = React.useState(
    JSON.parse(localStorage.getItem("activeTab")) || "adults"
  );

  const { categories } = useBooks();

  const handleTabChange = (tab) => {
    localStorage.setItem("activeTab", JSON.stringify(tab));
    setActiveTab(tab);
  };

  const renderCategories = (categories) => {
    return categories
      ?.filter(category => category.catId !== 'X')
      .map(category => (
        <li key={category.catId}>
          <Link to={`/books/${activeTab}/${category.catId}`}>
            <button>{category.name}</button>
          </Link>
        </li>
      ));
  };
  

  return (
    <section>
      <h2>Пошук за категорією</h2>
      <div>
        <div className="tabs">
          <button
            className={activeTab === "adults" ? "active" : ""}
            onClick={() => handleTabChange("adults")}
          >
            КНИГИ ДЛЯ ДОРОСЛИХ
          </button>
          <button
            className={activeTab === "children" ? "active" : ""}
            onClick={() => handleTabChange("children")}
          >
            КНИГИ ДЛЯ ДІТЕЙ
          </button>
          <Link to={`/books/adults/X`}>
          <button>БОНУСНІ КНИГИ</button>
        </Link>
        </div>
        {categories&&<div className="content">
          <ul>{renderCategories(categories[activeTab])}</ul>
        </div>}
      </div>
    </section>
  );
}
