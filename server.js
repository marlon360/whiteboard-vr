
const express = require('express');
const app = express();
const http = require('https').Server(app);
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

http.listen(3000, () => {
  console.log('server running at :3000');
});