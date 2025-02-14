import "./Election.css";

import { Link } from "react-router-dom";
import { ElectionModel } from "../types";

const Election = ({ id, title, description, thumbnail }: ElectionModel) => {
  return (
    <article className="election">
      <div className="election__image">
        <img src={thumbnail} alt={title} />
      </div>
      <div className="election__info">
        <Link to={`/elections/${id}`}>
          <h4>{title}</h4>
        </Link>
        <p>
          {description.length > 255
            ? description.substring(0, 255) + "..."
            : description}
        </p>
        <div className="election__cta">
          <Link to={`/elections/${id}`} className="btn sm primary">
            View
          </Link>
          <button className="btn sm primary">Edit</button>
        </div>
      </div>
    </article>
  );
};

export default Election;
