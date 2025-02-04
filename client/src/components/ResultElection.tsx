import { candidates } from "../data/data";
import { Election } from "../types";

const ResultElection = ({ id, thumbnail, title }: Election) => {
  const electionCandidates = candidates.filter(
    (candidate) => candidate.electionId === id,
  );
  return (
    <article className="result">
      <header className="result__header">
        <h4 className="result__title">{title}</h4>
        {/* <p className="result__date">Date: 2021-01-01</p> */}
        <div className="result_header-image">
          <img src={thumbnail} alt={title} />
        </div>
        <ul className="result__list">
          {electionCandidates.map((candidate) => (
            <li key={candidate.id} className="result__item">
              <span className="result__name">{candidate.fullName}</span>
              <span className="result__votes">{candidate.voteCount} votes</span>
            </li>
          ))}
        </ul>
      </header>
    </article>
  );
};

export default ResultElection;
