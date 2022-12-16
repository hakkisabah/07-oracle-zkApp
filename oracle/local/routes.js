const getScores = require("../getScore.js");
const url = require("url");
const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
};
exports.requestListener = async function (req, res) {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);
    res.setHeader("Content-Type", "application/json");
    res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    switch (req.url) {
        case "/score/1":
            res.writeHead(200);
            res.end(JSON.stringify(await getScores(1)));
            break
        case "/score/2":
            res.writeHead(200);
            res.end(JSON.stringify(await getScores(2)));
            break
        default:
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
    }
}