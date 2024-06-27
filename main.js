const http = require("http");

const PORT = 4000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end('{"message": "Hello World"}');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
