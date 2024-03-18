import { io } from 'socket.io-client';

let socket;

export const connectWithSocketServer = () => {
    socket = io('http://localhost:5000');

    socket.on('connect', () => {
        console.log('Connected to socket.io server');
    })
};

export const emitElementUpdates = (elementData) => {
    socket.emit('element-update', elementData)
};