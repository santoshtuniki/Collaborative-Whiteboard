// module imports
import React from 'react';

// component imports
import { toolTypes } from '../constants';
import { IconButton } from './IconButton';
import rectangleIcon from '../resources/icons/rectangle.svg';

export const Menu = () => {
    return (
        <div className='menu_container'>
            <IconButton src={rectangleIcon} type={toolTypes.RECTANGLE} />
        </div>
    )
}
