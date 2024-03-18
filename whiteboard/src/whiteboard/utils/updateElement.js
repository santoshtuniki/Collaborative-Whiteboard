// store imports
import { store } from '../../store/store';
import { setElements } from "../../store/whiteboardSlice";

// component imports
import { toolTypes } from "../../constants";
import { createElement } from "./createElement";
import { emitElementUpdates } from '../../socketConn/socketConn';

export const updateElement = ({ x1, y1, x2, y2, toolType, id, index }, elements) => {
    const elementsCopy = [...elements];

    switch (toolType) {
        case toolTypes.RECTANGLE: {
            const updatedElement = createElement({ x1, y1, x2, y2, toolType, id });
            elementsCopy[index] = updatedElement;
            store.dispatch(setElements(elementsCopy));
            emitElementUpdates(updatedElement);
            break;
        }

        default:
            throw new Error('Something went wrong when updating element')
    }
};