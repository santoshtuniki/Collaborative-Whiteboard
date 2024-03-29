// module imports
import React from 'react';

// component imports
import { toolTypes } from '../constants';
import { IconButton } from './IconButton';
import {
    rectangleIcon, lineIcon, rubberIcon, pencilIcon, textIcon, selectionIcon
} from '../resources/icons';

export const Menu = () => {
    return (
        <div className='menu_container'>
            <IconButton src={rectangleIcon} type={toolTypes.RECTANGLE} />
            <IconButton src={lineIcon} type={toolTypes.LINE} />
            <IconButton src={rubberIcon} type={toolTypes.RUBBER} isRubber={true} />
            <IconButton src={pencilIcon} type={toolTypes.PENCIL} />
            <IconButton src={textIcon} type={toolTypes.TEXT} />
            <IconButton src={selectionIcon} type={toolTypes.SELECTION} />
        </div>
    )
}
