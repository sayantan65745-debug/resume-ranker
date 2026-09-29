export const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const validateTopicWeights = (topics) => {
  const sum = topics.reduce((acc, topic) => acc + topic.weight, 0);
  return sum === 100;
};