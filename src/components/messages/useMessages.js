import { useCallback, useEffect, useState } from 'react';
import './Messages.scss';
import { socket } from '../../server/socket';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateMessages,
    addMessages,
    addMessage,
    updateMessageReadability,
} from '../../redux/reducers/actions';
import { v4 as uuidv4 } from 'uuid';

import { useHistory, useParams } from 'react-router-dom';

const useMessages = () => {
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [messageEvent, setMessageEvent] = useState('initial');

    const { id } = useParams();
    const user_id = useSelector((state) => state.user.id);
    const isMessages = useSelector(
        (state) => state.chat.messages.get(id)?.messages.length,
    );
    const dispatch = useDispatch();
    const history = useHistory();

    // подгружаем сообщения
    const loadMore = useCallback(
        () =>
            new Promise((resolve) => {
                setMessageEvent('loading');
                socket.emit('load_more_chat', id, isMessages);
                const listener = (data) => {
                    if (data.error) {
                        setError(data.error);
                        return;
                    } else if (data.hasOwnProperty('errorMessage')) {
                        history.push('/chat');
                    } else {
                        let data_messages = {
                            user: data.companion_id,
                            messages: data.messages,
                        };
                        dispatch(addMessages(data_messages));
                    }
                    setMessageEvent('loaded_old');
                    resolve();
                };
                socket.once('load_more_chat', listener);
            }),
        [dispatch, history, id, isMessages],
    );

    // обновление прочитанности конкретного сообщения
    const readMessage = useCallback(
        (message_id, user_id) => {
            socket.emit('read_message', message_id, user_id);
            let data_messages = {
                user: user_id,
                message_id: message_id,
                update_data: {
                    read: true,
                },
            };
            dispatch(updateMessageReadability(data_messages));
        },
        [dispatch],
    );

    // добавление нового сообщения
    const addNewMessage = useCallback(
        (newMessage) =>
            new Promise((resolve) => {
                setMessageEvent('loading');
                let newDate = +new Date();
                let newMessageId = uuidv4();
                dispatch(
                    addMessage({
                        user: id,
                        data: {
                            message_id: newMessageId,
                            its_me: true,
                            message: newMessage,
                            read: false,
                            time: newDate,
                        },
                    }),
                );

                let data = {
                    message_id: newMessageId,
                    message: newMessage,
                    time: newDate,
                    id: id,
                    isMessages: isMessages,
                };
                socket.emit('new_message', data);
                setMessageEvent('added' + newMessageId);
                resolve();
            }),
        [dispatch, id, isMessages],
    );

    // получаем список сообщений и данные о собеседнике
    useEffect(() => {
        if (id !== user_id) {
            socket.emit('current_chat', id);

            const listener = (data) => {
                if (data.error) {
                    setError(data.error);
                    return;
                } else if (data.hasOwnProperty('errorMessage')) {
                    history.push('/chat');
                } else {
                    let data_messages = {
                        user: data.companion_id,
                        data: {
                            fname: data.comp_fname,
                            lname: data.comp_lname,
                            is_online: data.online,
                            messages: data.messages,
                        },
                    };
                    dispatch(updateMessages(data_messages));
                }
                setFetching(false);
            };
            socket.on('current_chat', listener);
            return () => socket.off('current_chat', listener);
        } else {
            history.push('/chat');
        }
    }, [dispatch, history, id, user_id]);

    // новое сообщение
    useEffect(() => {
        const listener = (data) => {
            setMessageEvent('loading');
            if (data.error) {
                let data_messages = {
                    user: id,
                    message_id: data.id,
                    update_data: {
                        sent: false,
                    },
                };
                dispatch(addMessage(data_messages));
            } else {
                dispatch(
                    addMessage({
                        user: data[0].companion_id,
                        data: {
                            message_id: data[0].message_id,
                            its_me: data[0].its_me,
                            message: data[0].message,
                            read: !data[0].unread_messages,
                            time: data[0].time,
                        },
                    }),
                );
                setMessageEvent('received');
            }
        };
        socket.on('message', listener);
        return () => socket.off('message', listener);
    }, [dispatch, id]);

    // прочитанность сообщения
    useEffect(() => {
        const listener = (data) => {
            if (data.error) {
                setError(data.error);
                return;
            } else if (data.hasOwnProperty('errorMessage')) {
                history.push('/chat');
            } else {
                let data_messages = {
                    user: id,
                    message_id: data[0].message_id,
                };
                dispatch(updateMessageReadability(data_messages));
            }
        };

        socket.on('update_read_message', listener);
        return () => socket.off('update_read_message', listener);
    }, [dispatch, history, id]);

    return {
        loadMore,
        readMessage,
        addNewMessage,
        error,
        fetching,
        messageEvent,
    };
};

export default useMessages;
