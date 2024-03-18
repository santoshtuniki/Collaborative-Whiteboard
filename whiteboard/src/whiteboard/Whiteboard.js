// module imports
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import rough from 'roughjs';

// store imports
import { updateElement as updateElementInStore } from '../store/whiteboardSlice';

// component imports
import { Menu } from './Menu';
import { actions, toolTypes } from '../constants';
import { createElement, updateElement, drawElement, adjustmentRequired, adjustElementCoordinates } from './utils';


let selectedElement;

const setSelectedElement = (el) => {
    selectedElement = el;
};

const Whiteboard = () => {
    const canvasRef = useRef();
    const toolType = useSelector((state) => state.whiteboard.tool);
    const elements = useSelector((state) => state.whiteboard.elements);

    const [action, setAction] = useState(null);

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const roughCanvas = rough.canvas(canvas);
        elements.forEach((element) => {
            drawElement({ roughCanvas, context: ctx, element })
        })
    }, [elements]);

    const handleMouseUp = (event) => {
        const index = elements.findIndex((el) => el?.id === selectedElement?.id);
        if (index > -1) {
            if (action === actions.DRAWING) {
                if (adjustmentRequired(elements[index].type)) {
                    const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);

                    updateElement({
                        index,
                        id: elements[index].id,
                        x1,
                        y1,
                        x2,
                        y2,
                        toolType: elements[index].type,
                    }, elements)
                }
            }
        }

        setAction(null);
        setSelectedElement(null);
    };

    const handleMouseDown = (event) => {
        const { clientX, clientY } = event;
        if (!toolType) {
            return;
        }

        if (
            toolType === toolTypes.RECTANGLE ||
            toolType === toolTypes.LINE ||
            toolType === toolTypes.PENCIL
        ) {
            setAction(actions.DRAWING);
            const element = createElement({
                x1: clientX,
                y1: clientY,
                x2: clientX,
                y2: clientY,
                toolType,
                id: uuid()
            });
            setSelectedElement(element);
            dispatch(updateElementInStore(element));
        }
    };

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        if (!toolType) {
            return;
        }

        if (action === actions.DRAWING) {
            // find index of selected element
            const index = elements.findIndex((el) => el?.id === selectedElement?.id);
            if (index !== -1) {
                updateElement({
                    index,
                    id: elements[index].id,
                    x1: elements[index].x1,
                    y1: elements[index].y1,
                    x2: clientX,
                    y2: clientY,
                    toolType: elements[index].type,
                }, elements)
            }
        }
    };

    return (
        <>
            <Menu />
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
        </>
    )
}

export default Whiteboard;