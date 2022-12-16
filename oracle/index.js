const getScore = require("./getScore.js");
const setScore = require("./setScore.js");

// const headers = {
//   "Access-Control-Allow-Headers": "Content-Type",
//   "Access-Control-Allow-Origin" : "*",
//   "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
// }

const getHandler = async(id) => {
  // TODO implement
  console.log("getHandler id value",id);
  return {
    statusCode: 200,
    // headers,
    body: await getScore(id)
  };
};

const postHandler = async (body) => {
  // TODO implement
  console.log("setHandler score body",body);
  return {
    statusCode: 200,
    // headers,
    body: await setScore(body)
  };
};

module.exports.handler = async (event, context) => {
  console.log("event",event);
  const path = event.requestContext.http.path.split("/");

  console.log("path",path)
  if (path[1] === "score") {

    console.log("score",path[1])
    if (event.requestContext.http.method === "GET") {
      // if length is 3, then we have an id
      if (path.length < 3) return { statusCode: 400, body: "Require user id" };

      console.log("get value",path[2])
      // check if id is valid
      if (!isNaN(parseInt(path[2]))) {
        return await getHandler(parseInt(path[2]));
      } else {
        return { statusCode: 400, body: "Invalid user id, id must be a number" };
      }
    }
    if (event.requestContext.http.method === "POST") {
      const body = JSON.parse(event.body);
      console.log("post body", JSON.parse(event.body))

      const isValid = !isNaN(parseInt(body.score));
      if (!body.score || !isValid) return { statusCode: 400, body: "Require score" };
      if (isValid && (+body.score > 1 &&  +body.score % 2 !== 0)) return { statusCode: 400, body: "Require at least 1 or bigger than and must be Integer" };

      return await postHandler(body);
    }
  }
  return {
    statusCode: 400,
    body: "error"
  };
}