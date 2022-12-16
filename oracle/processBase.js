const { isReady, PrivateKey, Field, Signature } = require("snarkyjs");

// https://github.com/jackryanservia/mina-credit-score-signer/blob/247a6e3db7f0e8c3c9ef8cec7a472aca29127d49/index.js
async function processBase({userId, score}) {
  console.log("userId",+userId)
  console.log("score",+score)
  // We need to wait for SnarkyJS to finish loading before we can do anything
  await isReady;

  // The private key of our account. When running locally the hardcoded key will
  // be used. In production the key will be loaded from a Vercel environment
  // variable.
  const prv = process.env.PRIVATE_KEY || require("./serverenv.json").Variables.PRIVATE_KEY
  
  const privateKey = PrivateKey.fromBase58(prv);

  // We get the users credit score. In this case it's 787 for user 1, and 536
  // for anybody else :)
  // const knownCreditScore = (userId) => (userId === "1" ? 787 : 536);

  // We compute the public key associated with our private key
  const publicKey = privateKey.toPublicKey();
  // Define a Field with the value of the users id
  const id = Field(+userId);

  // Define a Field with the users credit score
  const creditScore = Field(+score);

  // Use our private key to sign an array of Fields containing the users id and
  // credit score
  const signature = Signature.create(privateKey, [id, creditScore]);

  return {
    data: { id: id, creditScore: creditScore },
    signature: signature.toJSON(),
    publicKey: publicKey,
  };
}

module.exports = processBase;