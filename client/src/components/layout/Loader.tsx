import "./Loader.css";

import Spinner from "../../assets/loader.gif";

const Loader = () => {
  return (
    <section className="loader">
      <div className="loader__container">
        <p>Loading....</p>
        <img src={Spinner} alt="Loading spinner" />
      </div>
    </section>
  );
};

export default Loader;
