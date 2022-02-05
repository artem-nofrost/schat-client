import io from 'socket.io-client';
import config from '../config';

export let socket;
export const connect_socket = () => {
    socket = io(config.server.address + ':' + config.server.port, {
        withCredentials: true,
    });
    return socket;
};
