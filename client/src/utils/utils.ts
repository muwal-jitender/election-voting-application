export const calculateVoteCount = (voteCount: number, totalVotes: number) => {
  if (!voteCount && !totalVotes) return 0;
  const totalCount = (voteCount / totalVotes) * 100;
  return totalCount;
};

export const tooltipStyles = {
  backgroundColor: "var(--color-primary)",
  color: "var(--color-gray-0)",
  maxWidth: "50rem",
  whiteSpace: "normal",
  fontSize: "0.85rem",
};
