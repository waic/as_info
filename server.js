const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// /docs/as/info/ パスでアクセスされた場合のリライト
app.use('/docs/as/info', express.static(path.join(__dirname, 'docs'), {
  index: 'index.html',
  extensions: ['html']
}));

// ルートパスでも静的ファイルを配信
app.use(express.static(path.join(__dirname, 'docs'), {
  index: 'index.html',
  extensions: ['html']
}));

// 404の場合はindex.htmlを返す（SPAモード）
app.use((req, res, next) => {
  // /docs/as/info/ で始まるパスの場合
  if (req.path.startsWith('/docs/as/info/')) {
    const filePath = req.path.replace('/docs/as/info', '') || '/';
    const fullPath = path.join(__dirname, 'docs', filePath);
    // ディレクトリの場合はindex.htmlを追加
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      const indexPath = path.join(fullPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    // ファイルが存在する場合はそのファイルを返す
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return res.sendFile(fullPath);
    }
  }
  // ファイルが存在しない場合はindex.htmlを返す
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
