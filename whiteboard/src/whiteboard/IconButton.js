// module imports
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store imports
import { setElements, setToolType } from '../store/whiteboardSlice';
import { emitClearCanvas } from '../socketConn/socketConn';


export const IconButton = ({ src, type, isRubber = false }) => {
    const dispatch = useDispatch();
    const selectedToolType = useSelector((state) => state.whiteboard.tool);

    const handleToolChange = () => {
        dispatch(setToolType(type));
    };

    const handleClearCanvas = () => {
        dispatch(setElements([]));
        emitClearCanvas();
    };

    return (
        <button
            onClick={isRubber ? handleClearCanvas : handleToolChange}
            className={selectedToolType === type ? 'menu_button_active' : 'menu_button'}
        >
            <img src={src} height='80%' width='80%' alt={type} />
        </button>
    );
}
