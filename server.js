const express = require('express');
const { createServer } = require('node:http');
const socket = require('socket.io');
const { Server } = require('socket.io')

const app = express();
const PORT = 3000 || process.env.PORT;
const server = createServer(app)

app.use(express.static('public'));

const io = new Server(server);

let users = [];

io.on("connection",(socket) => {
    console.log("made socket connection", socket.id);

        
    socket.on('join',(data) =>{
        users.push(data);
        io.sockets.emit('join',data);
    });

    socket.on('joined',() =>{
        socket.emit('joined',users);
    });

    socket.on('rollDice',(data) =>{
        users[data.id].pos = data.pos;
        const turn = data.num !=6 ? (data.id+1)%users.length : data.id;
        io.sockets.emit('rollDice',data,turn);
    });

    socket.on('restart',() =>{
        users = [];
        io.sockets.emit("restart");
    })


});


server.listen(PORT,() =>{
    console.log(`sever running on port ${PORT}`);
})