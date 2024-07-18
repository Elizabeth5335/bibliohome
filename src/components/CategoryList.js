import React from "react";
import { categories } from "../categories";

export default function CategoryList(props) {
  const [activeTab, setActiveTab] = React.useState("adult");

  return (
    <>
      <h2>Пошук за категорією</h2>
      <div>
        <div className="tabs" style={{paddingBottom: "1rem", borderBottom: "1px solid grey"}}>
          <button
          style={{marginRight: "3rem", background: "dark-grey"}}
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
        <div className="content">
        <ul
        style={{listStyle: "none", display: "flex", flexWrap: "wrap", maxWidth: "700px", margin: "1rem auto"}}
        >
        {Object.values(categories[activeTab]).map((category) => {
          return (
            <li>
              <button onClick={() => window.alert(category)}>{category}</button>
            </li>
          );
        })}
      </ul>
        </div>
      </div>
    </>
  );
}
