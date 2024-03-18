// module imports
import { io } from 'socket.io-client';

// component imports
import { store } from '../store/store';
import { setElements, updateElement } from '../store/whiteboardSlice';

let socket;

export const connectWithSocketServer = () => {
    socket = io('http://localhost:5000');

    socket.on('connect', () => {
        console.log('Connected to socket.io server');
    });

    socket.on('whiteboard-state', (elements) => {
        store.dispatch(setElements(elements));
    });

    socket.on('element-update', (elementData) => {
        store.dispatch(updateElement(elementData));
    });

    socket.on('whiteboard-clear', () => {
        store.dispatch(setElements([]));
    });
};

export const emitElementUpdates = (elementData) => {
    socket.emit('element-update', elementData)
};

export const emitClearCanvas = () => {
    socket.emit('whiteboard-clear');
};