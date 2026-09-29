import { matchTopic } from "./topicMatchingService.js";

export const calculateScore = (resumeText, topics) => {
  const topicScores = topics.map((t) => {
    const matchScore = matchTopic(resumeText, t.name);
    const weightedScore = matchScore * (t.weight / 100);
    return { topicId: t.topicId, topicName: t.name, weight: t.weight, matchScore, weightedScore };
  });

  const overallScore = topicScores.reduce((sum, t) => sum + t.weightedScore, 0);
  return { overallScore, topicScores };
};

export const assignRelativeRanks = (scores) => {
  const sorted = [...scores].sort((a, b) => b.overallScore - a.overallScore);
  let rank = 1;
  return sorted.map((s, i) => {
    if (i > 0 && s.overallScore < sorted[i - 1].overallScore) rank = i + 1;
    return { ...s, rank };
  });
};