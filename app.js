const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket szerver fut...\n');
});

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const userIo = io.of('/user');
let playerArray = [];

userIo.on('connection', (socket) => {
    socket.on('player-joined', (player) => {
        player.socketId = socket.id;
        playerArray.push(player);
        userIo.emit('user-list', playerArray);
    })

    socket.on('lobby-chat', (player, message) => {
        console.log(`Kliens üzenet: ${message}`);
        userIo.emit('lobby-chat', player, message);
    });

    socket.on('disconnect', () => {
        playerArray = playerArray.filter(player => player.socketId != socket.id);
        console.log(playerArray);
        userIo.emit('user-list', playerArray);
        console.log('Kliens lekapcsolódott');
    });
});

server.listen(3001, () => {
    console.log('WebSocket szerver fut a 3001-es porton.');
});