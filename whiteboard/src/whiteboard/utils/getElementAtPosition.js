// component imports
import { toolTypes, cursorPositions } from "../../constants";

const nearPoint = (x, y, x1, y1, cursorPosition) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? cursorPosition : null;
};

const insidePoint = (x, y, element, cursorPosition) => {
    const { x1, y1, x2, y2 } = element;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? cursorPosition : null;
};

const positionWithinElement = (x, y, element) => {
    const { x1, y1, x2, y2, type } = element;

    switch (type) {
        case toolTypes.RECTANGLE: {
            const topLeft = nearPoint(x, y, x1, y1, cursorPositions.TOP_LEFT);
            const topRight = nearPoint(x, y, x2, y1, cursorPositions.TOP_RIGHT);
            const bottomLeft = nearPoint(x, y, x1, y2, cursorPositions.BOTTOM_LEFT);
            const bottomRight = nearPoint(x, y, x2, y2, cursorPositions.BOTTOM_RIGHT);
            const inside = insidePoint(x, y, element, cursorPositions.INSIDE);

            return topLeft || topRight || bottomLeft || bottomRight || inside;
        }

        case toolTypes.TEXT: {
            return insidePoint(x, y, element, cursorPositions.INSIDE);
        }

        default:
            break;
    }
};

export const getElementAtPosition = (x, y, elements) => {
    return elements
        .map((element) => ({
            ...element,
            position: positionWithinElement(x, y, element)
        }))
        .find((el) => el?.position !== null && el?.position !== undefined);
};
