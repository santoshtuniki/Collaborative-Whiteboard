// module imports
import { configureStore } from '@reduxjs/toolkit';

// component imports
import whiteboardReducer from './whiteboardSlice';


export const store = configureStore({
    reducer: {
        whiteboard: whiteboardReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: ['whiteboard/setElements'],
                ignorePaths: ['whiteboard.elements']
            }
        })
});
