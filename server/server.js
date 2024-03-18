const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);

app.use(cors());

let elements = [];

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('User connected', socket.id);
    io.to(socket.id).emit('whiteboard-state', elements);

    socket.on('element-update', (elementData) => {
        updateElementsData(elementData)
    })
})

const updateElementsData = (elementData) => {
    const index = elements.findIndex((element) => element?.id === elementData?.id);

    if (index === -1){
        elements.push(elementData);
        return;
    }

    elements[index] = elementData;
};

app.get('/', (req, res) => {
    res.send('Hello, server is running.')
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})