// module imports
import rough from 'roughjs';

// component imports
import { toolTypes } from "../../constants";

const generator = rough.generator();

const generateRectangle = ({ x1, y1, x2, y2 }) => {
    return generator.rectangle(x1, y1, x2 - x1, y2 - y1); // x, y, width, height
};

const generateLine = ({ x1, y1, x2, y2 }) => {
    return generator.line(x1, y1, x2, y2);
};

export const createElement = ({ x1, y1, x2, y2, toolType, id }) => {
    let roughElement;

    switch (toolType) {
        case toolTypes.RECTANGLE: {
            roughElement = generateRectangle({ x1, y1, x2, y2 });
            return {
                id: id,
                roughElement,
                type: toolType,
                x1,
                y1,
                x2,
                y2,
            }
        }

        case toolTypes.LINE: {
            roughElement = generateLine({ x1, y1, x2, y2 });
            return {
                id: id,
                roughElement,
                type: toolType,
                x1,
                y1,
                x2,
                y2,
            }
        }

        default:
            throw new Error('Something went wrong when creating element')
    }
};