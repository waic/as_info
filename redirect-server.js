const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 8080;
const docsDir = path.join(__dirname, 'docs');

// リダイレクトルール: .html拡張子付きURL → スラッシュ付きURL
function getRedirectPath(url) {
  // /criteria/{id}.html → /criteria/{id}/
  const criteriaMatch = url.match(/^\/criteria\/([^\/]+)\.html$/);
  if (criteriaMatch) {
    return `/criteria/${criteriaMatch[1]}/`;
  }
  
  // /techs/{id}.html → /techs/{id}/
  const techsMatch = url.match(/^\/techs\/([^\/]+)\.html$/);
  if (techsMatch) {
    return `/techs/${techsMatch[1]}/`;
  }
  
  // /results/{id}.html → /results/{id}/
  const resultsMatch = url.match(/^\/results\/([^\/]+)\.html$/);
  if (resultsMatch) {
    return `/results/${resultsMatch[1]}/`;
  }
  
  return null;
}

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0]; // クエリパラメータを除去
  
  // リダイレクトが必要かチェック
  const redirectPath = getRedirectPath(url);
  if (redirectPath) {
    res.writeHead(301, {
      'Location': redirectPath,
      'Cache-Control': 'public, max-age=31536000'
    });
    res.end();
    return;
  }
  
  // ディレクトリの場合はindex.htmlを追加
  if (url.endsWith('/')) {
    url = path.join(url, 'index.html');
  }
  
  // ファイルパスを解決
  const filePath = path.join(docsDir, url);
  
  // セキュリティチェック: docsディレクトリ外へのアクセスを防ぐ
  const resolvedPath = path.resolve(filePath);
  const resolvedDocsDir = path.resolve(docsDir);
  if (!resolvedPath.startsWith(resolvedDocsDir + path.sep) && resolvedPath !== resolvedDocsDir) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  // ファイルが存在するかチェック
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    const ext = path.extname(resolvedPath);
    let contentType = 'text/html';
    
    if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.ico') contentType = 'image/x-icon';
    
    const content = fs.readFileSync(resolvedPath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } else {
    // 404: index.htmlを返す（SPAモード）
    const indexPath = path.join(docsDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
