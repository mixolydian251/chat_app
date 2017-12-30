const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');


const publicPath = path.join(__dirname, '..', 'public');
const app = express();



const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {

    socket.emit('newMessage', {
        from: 'Chat App',
        message: 'Welcome to the chat room',
        createdAt: moment().format('x')
    });

    socket.on('createMessage', (message) => {
        io.emit('newMessage', {
            ...message,
            createdAt: moment().format('x')
        });
    });

    socket.on('userJoined', (user) => {
        socket.broadcast.emit('alertUserJoined', user);
    })
});


app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

server.listen(3000, () => {
    console.log(`Server is up on port ${3000}`);
});