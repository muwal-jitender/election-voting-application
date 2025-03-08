export const calculateVoteCount = (voteCount: number, totalVotes: number) => {
  if (!voteCount && !totalVotes) return 0;
  const totalCount = (voteCount / totalVotes) * 100;
  return totalCount;
};
