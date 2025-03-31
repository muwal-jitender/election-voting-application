import "./Loader.css";

import Spinner from "../../assets/images/general/loader.gif";

const Loader = () => {
  return (
    <section className="loader">
      <div className="loader__container">
        <img src={Spinner} alt="Loading spinner" />
      </div>
    </section>
  );
};

export default Loader;
