const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// 静的ファイルを配信（docsフォルダをルートとして）
app.use(express.static(path.join(__dirname, 'docs')));

// /docs/as/info/ パスでアクセスされた場合のリライト
app.use('/docs/as/info', express.static(path.join(__dirname, 'docs')));

// すべてのリクエストに対してindex.htmlを返す（SPAモード）
app.get('*', (req, res) => {
  // /docs/as/info/ で始まるパスの場合
  if (req.path.startsWith('/docs/as/info/')) {
    const filePath = req.path.replace('/docs/as/info', '');
    const fullPath = path.join(__dirname, 'docs', filePath);
    // ファイルが存在する場合はそのファイルを返す
    res.sendFile(fullPath, (err) => {
      if (err) {
        // ファイルが存在しない場合はindex.htmlを返す
        res.sendFile(path.join(__dirname, 'docs', 'index.html'));
      }
    });
  } else {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
