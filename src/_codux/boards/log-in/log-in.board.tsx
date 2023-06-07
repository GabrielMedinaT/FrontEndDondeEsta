import React from 'react';
import { createBoard } from '@wixc3/react-board';
import LogIn from '../../../components/LogIn.jsx';

export default createBoard({
    name: 'LogIn',
    Board: () => <LogIn />
});
