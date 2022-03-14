import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocketState } from '../redux/reducers/actions';

import { connect_socket, socket } from './socket';

const Connect = (props) => {
    const isAuth = useSelector((state) => state.user.is_auth);
    const email = useSelector((state) => state.user.email);
    const dispatch = useDispatch();

    React.useEffect(() => {
        connect_socket();
        if (isAuth) {
            socket.emit('online', email, (response) => {
                if (response.status === 'ok') {
                    dispatch(setSocketState('connected'));
                }
            });
        } else {
            dispatch(setSocketState('connected'));
        }
    }, [dispatch, email, isAuth]);

    return null;
};

export default Connect;
