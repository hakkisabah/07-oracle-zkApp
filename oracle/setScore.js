const processBase = require("./processBase.js");

async function setSignedCreditScore(body) {
  console.log("Setting signed credit score to", body);
  // We create a new field for id element from the score
  const mockId = Math.floor((Math.random(1,100) * 100)) + 1
  return await processBase({userId:mockId, score:body.score})
}

module.exports = setSignedCreditScore;