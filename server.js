const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルの配信
app.use(express.static('public'));

// メインルート
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/robot-club', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'robot-club.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});