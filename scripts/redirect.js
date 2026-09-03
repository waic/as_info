import http from 'http';

const TARGET_BASE = 'https://waic.github.io/as_info';
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const path = req.url === '/' || req.url === '' ? '' : req.url;
  const target = TARGET_BASE + path;
  res.writeHead(301, { Location: target });
  res.end();
});

server.listen(PORT, () => {
  console.log(`Redirect server listening on port ${PORT}`);
});
