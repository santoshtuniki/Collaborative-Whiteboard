// module imports
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import rough from 'roughjs';

// store imports
import { updateElement as updateElementInStore } from '../store/whiteboardSlice';

// component imports
import { Menu } from './Menu';
import { actions, cursorPositions, toolTypes } from '../constants';
import {
    createElement, updateElement, drawElement, adjustmentRequired, adjustElementCoordinates,
    getElementAtPosition, getCursorForPosition, getResizedCoordinates
} from './utils';

const Whiteboard = () => {
    const canvasRef = useRef();
    const textAreaRef = useRef();

    const toolType = useSelector((state) => state.whiteboard.tool);
    const elements = useSelector((state) => state.whiteboard.elements);

    const [action, setAction] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);

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
            if (action === actions.DRAWING || action === actions.RESIZING) {
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

        if (selectedElement && action === actions.WRITING) {
            return;
        }

        switch (toolType) {
            case toolTypes.RECTANGLE:
            case toolTypes.LINE:
            case toolTypes.PENCIL: {
                const element = createElement({
                    x1: clientX,
                    y1: clientY,
                    x2: clientX,
                    y2: clientY,
                    toolType,
                    id: uuid()
                });

                setAction(actions.DRAWING);
                setSelectedElement(element);
                dispatch(updateElementInStore(element));
                break;
            }

            case toolTypes.TEXT: {
                const element = createElement({
                    x1: clientX,
                    y1: clientY,
                    x2: clientX,
                    y2: clientY,
                    toolType,
                    id: uuid()
                });

                setAction(actions.WRITING);
                setSelectedElement(element);
                dispatch(updateElementInStore(element));
                break;
            }

            case toolTypes.SELECTION: {
                const element = getElementAtPosition(clientX, clientY, elements);

                if (element && element.type === toolTypes.RECTANGLE) {
                    element?.position === cursorPositions.INSIDE ?
                        setAction(actions.MOVING) :
                        setAction(actions.RESIZING);

                    const offsetX = clientX - element.x1;
                    const offsetY = clientY - element.y1;
                    console.log({ ...element, offsetX, offsetY });
                    setSelectedElement({ ...element, offsetX, offsetY });
                }

                break;
            }

            default:
                break;
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

        if (toolType === toolTypes.SELECTION) {
            const element = getElementAtPosition(clientX, clientY, elements);
            event.target.style.cursor = element ? getCursorForPosition(element?.position) : 'default';
        }
        console.log(selectedElement);

        if (
            toolType === toolTypes.SELECTION &&
            action === actions.MOVING &&
            selectedElement
        ) {
            const { id, x1, y1, x2, y2, type, offsetX, offsetY } = selectedElement;

            const width = x2 - x1;
            const height = y2 - y1;

            const newX1 = clientX - offsetX;
            const newY1 = clientY - offsetY;

            const index = elements.findIndex((el) => el?.id === selectedElement?.id);
            if (index > -1) {
                updateElement({
                    index,
                    id,
                    x1: newX1,
                    y1: newY1,
                    x2: newX1 + width,
                    y2: newY1 + height,
                    toolType: type,
                }, elements)
            }
        }

        if (
            toolType === toolTypes.SELECTION &&
            action === actions.RESIZING &&
            selectedElement
        ) {
            const { id, type, position, ...coordinates } = selectedElement;
            const { x1, y1, x2, y2 } = getResizedCoordinates(clientX, clientY, position, coordinates);

            const index = elements.findIndex((el) => el?.id === selectedElement?.id);
            if (index > -1) {
                updateElement({
                    index,
                    id,
                    x1,
                    y1,
                    x2,
                    y2,
                    toolType: type,
                }, elements)
            }
        }
    };

    const handleTextAreaBlur = (event) => {
        const { id, x1, y1, type } = selectedElement;
        const index = elements.findIndex((el) => el?.id === selectedElement?.id);
        if (index !== -1) {
            updateElement({
                index,
                id,
                x1,
                y1,
                toolType: type,
                text: event.target.value
            }, elements)

            setAction(null);
            setSelectedElement(null);
        }
    };

    return (
        <>
            <Menu />
            {
                action === actions.WRITING &&
                <textarea
                    ref={textAreaRef}
                    onBlur={handleTextAreaBlur}
                    style={{
                        position: 'absolute',
                        top: selectedElement.y1 - 3,
                        left: selectedElement.x1,
                        font: '24px sans-serif',
                        margin: 0,
                        padding: 0,
                        border: 0,
                        outline: 0,
                        resize: 'auto',
                        overflow: 'hidden',
                        whiteSpace: 'pre',
                        background: 'transparent',
                    }}
                />
            }
            <canvas
                id='canvas'
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