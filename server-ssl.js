
const express = require('express');
const port = process.env.PORT || 3000
const app = express();
const fs = require('fs');
const http = require('https').createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'marlon'
}, app);
const io = require('socket.io')(http);

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.render('index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('draw', function (obj) {
    io.emit('remoteDraw', obj, { for: 'everyone' });
  });
});

http.listen(port, () => {
  console.log('server running at :3000');
});