// module imports
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store imports
import { setToolType } from '../store/whiteboardSlice';


export const IconButton = ({ src, type }) => {
    const dispatch = useDispatch();
    const selectedToolType = useSelector((state) => state.whiteboard.tool);

    const handleToolChange = () => {
        dispatch(setToolType(type))
    }

    return (
        <button
            onClick={handleToolChange}
            className={selectedToolType === type ? 'menu_button_active' : 'menu_button'}
        >
            <img src={src} height='80%' width='80%' alt={type} />
        </button>
    );
}
