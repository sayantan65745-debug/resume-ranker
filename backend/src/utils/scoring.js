export const calculateWeightedScore = (matchScore, weight) => {
  return matchScore * (weight / 100);
};

export const calculateOverallScore = (topicScores) => {
  return topicScores.reduce((sum, topic) => sum + topic.weightedScore, 0);
};