import React from "react";

export default function BookCard(props) {
  return (
    <div className="bookCard" style={{margin: "2rem"}}>
      <img
        src={
          props.url ||
          "https://timvandevall.com/wp-content/uploads/2014/01/Book-Cover-Template.jpg"
        }
        alt={props.name}
        width={"100px"}
      />
      <div style={{display: "flex", flexDirection: "column", maxWidth: "150px"}}>
      <strong>{props.name}</strong>
      <span>Вартість оренди: {props.price} zł</span>
      </div>
    </div>
  );
}
