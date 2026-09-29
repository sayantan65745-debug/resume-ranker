const ALIASES = {
  "data structures": ["data structures", "dsa", "arrays", "linked list", "trees", "graphs", "stack", "queue"],
  "c++": ["c++", "cpp", "stl", "standard template library"],
  java: ["java", "jvm", "spring"],
  sql: ["sql", "mysql", "postgresql", "mongodb"],
  git: ["git", "github", "gitlab"],
  english: ["english", "communication"]
};

export const matchTopic = (text, topicName) => {
  const keywords = ALIASES[topicName.toLowerCase()] || [topicName.toLowerCase()];
  let matches = 0;
  for (const kw of keywords) {
    const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    matches += (text.match(regex) || []).length;
  }
  return Math.min(100, matches * 20);
};