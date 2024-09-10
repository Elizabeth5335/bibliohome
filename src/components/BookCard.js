import React from "react";
import { Link } from "react-router-dom";

export default function BookCard(props) {
  return (
    <div className="bookCard">
      <Link to={`/book/${props.id}`}>
      <img
        src={
          props.url ||
          "https://timvandevall.com/wp-content/uploads/2014/01/Book-Cover-Template.jpg"
        }
        alt={props.name}
        loading="lazy"
      />
      <div
        className="text"
      >
        <strong>{props.name}</strong>
        {props.author && <strong>Автор: {props.author}</strong>}
        {props.price && <span>Вартість прокату: {props.price}zł</span>}
      </div></Link>
    </div>
  );
}
