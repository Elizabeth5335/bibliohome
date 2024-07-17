import React from "react";

export default function CategoryList() {
  return (
    <>
      <h2>Пошук за категорією</h2> 
      {/* make tabs - adults|children and then list of cats */}
      <ul>
        <li><button onClick={()=>window.alert("cat1")}>Cat1</button></li>
        <li><button onClick={()=>window.alert("cat1")}>Cat2</button></li>
        <li><button onClick={()=>window.alert("cat1")}>Cat3</button></li>
        <li><button onClick={()=>window.alert("cat1")}>Cat4</button></li>
      </ul>
      {/* CategoryList */}
      {/* searchbar */}
      {/* randombook */}
    </>
  );
}
