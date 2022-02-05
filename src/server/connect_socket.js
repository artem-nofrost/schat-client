import io from 'socket.io-client';

export let socket;
export const connect_socket = () => {
	socket = io("http://127.0.0.1:4001")
	return socket;
};
