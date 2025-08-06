export function isEcellRelevant(input) {
  const allowedKeywords = [
    "ecell", "entrepreneur", "event", "startup", "team", "member", "join", "ucer", "hackathon"
  ];
  return allowedKeywords.some(word => input.toLowerCase().includes(word));
}
