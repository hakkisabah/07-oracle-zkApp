const getScores = require("../getScore.js");

exports.requestListener = async function (req, res) {
    res.setHeader("Content-Type", "application/json");
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