const processBase = require("./processBase.js");

async function getSignedCreditScore(userId) {
  console.log("Getting credit score for user", userId);
  const knownCreditScore = (userId) => (userId === 1  ? 787 : 536);
  return await processBase({userId:userId, score: knownCreditScore(userId)});
}

module.exports = getSignedCreditScore;