import "./Congrats.css";

import { Link } from "react-router-dom";

const Congrats = () => {
  return (
    <section className="congrats">
      <div className="container congrats__container">
        <div className="congrats__content">
          <h2>Thanks for your vote!</h2>
          <p>
            Your vote has been successfully casted. Please follow the below link
            to see the result.
          </p>
          <Link to="/results" className="btn sm primary">
            See Results
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Congrats;
