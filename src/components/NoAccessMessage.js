import { Link } from "react-router-dom";

export default function NoAccessMessage() {
  return (
    <div>
      <span>У вас немає доступу до цієї стрінки! Увійдіть спершу!</span>
      <Link to="/login">
        <button>Увійти</button>
      </Link>
    </div>
  );
}
