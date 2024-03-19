// store imports
import { store } from '../../store/store';
import { setElements } from "../../store/whiteboardSlice";

// component imports
import { toolTypes } from "../../constants";
import { createElement } from "./createElement";
import { emitElementUpdates } from '../../socketConn/socketConn';

export const updateElement = ({ x1, y1, x2, y2, toolType, id, index, text = '' }, elements) => {
    const elementsCopy = [...elements];

    switch (toolType) {
        case toolTypes.LINE:
        case toolTypes.RECTANGLE: {
            const updatedElement = createElement({ x1, y1, x2, y2, toolType, id });
            elementsCopy[index] = updatedElement;
            store.dispatch(setElements(elementsCopy));
            emitElementUpdates(updatedElement);
            break;
        }

        case toolTypes.PENCIL: {
            const updatedPencilElement = {
                ...elementsCopy[index],
                points: [
                    ...elementsCopy[index].points,
                    { x: x2, y: y2 },
                ]
            }
            elementsCopy[index] = updatedPencilElement;
            store.dispatch(setElements(elementsCopy));
            emitElementUpdates(updatedPencilElement);
            break;
        }

        case toolTypes.TEXT: {
            const textWidth = document
                .getElementById('canvas')
                .getContext('2d')
                .measureText(text).width;

            const textHeight = 24;
            const updatedTextElement = createElement({
                x1,
                y1,
                x2: x1 + textWidth,
                y2: y1 + textHeight,
                toolType,
                text,
                id
            });
            elementsCopy[index] = updatedTextElement;
            store.dispatch(setElements(elementsCopy));
            emitElementUpdates(updatedTextElement);
            break;
        }

        default:
            throw new Error('Something went wrong when updating element')
    }
};
