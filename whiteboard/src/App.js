// module imports
import React, { useEffect } from 'react';

// component imports
import Whiteboard from './whiteboard/Whiteboard';
import { connectWithSocketServer } from './socketConn/socketConn';

const App = () => {

    useEffect(() => {
        connectWithSocketServer();
    }, []);

    return (
        <div>
            <Whiteboard />
        </div>
    );
}

export default App;
