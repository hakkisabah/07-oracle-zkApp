const http = require("http");

const {requestListener} = require("./local/routes.js")

const host = 'localhost';
const port = 8000;

const server = http.createServer();
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
server.on('request', async (req,res) => requestListener(req,res));