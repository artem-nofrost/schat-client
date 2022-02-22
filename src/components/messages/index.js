import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import './Messages.scss';
import { useTranslation } from 'react-i18next';
import { Container, Button } from 'react-bootstrap';
import { socket } from '../../server/socket';
import { useDispatch, useSelector } from 'react-redux';
import {
    loadMessages,
    loadMoreMessages,
    setBottomDialog,
    updateMessages,
    updateReadMessage,
} from '../../redux/reducers/actions';
import { dater } from '../../lib/date';
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import InputMessage from './Input';

const Chat = () => {
    const { t, i18n } = useTranslation();
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadMore, setIsLoadMore] = useState(false);

    let { id } = useParams();
    const history = useHistory();
    const user_id = useSelector((state) => state.user.id);
    const chatMessages = useSelector((state) => state.chat.messages);
    const dispatch = useDispatch();

    const ref = useRef();
    const refList = useRef();

    // подгружаем сообщения
    const loadMore = useCallback(async () => {
        let oldScrollTop = refList.current.scrollTop;
        let oldScrollHeight = refList.current.scrollHeight;
        setIsLoadMore(true);
        socket.emit('load_more_chat', id, chatMessages.get(id).messages.length);

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
                dispatch(loadMoreMessages(data_messages));
            }
            let scrollNewPosition =
                oldScrollTop + (refList.current.scrollHeight - oldScrollHeight);
            refList.current.scrollTo(0, scrollNewPosition);

            setIsLoadMore(false);
        };
        socket.once('load_more_chat', listener);
    }, [chatMessages, dispatch, history, id]);

    const listScroll = useCallback(() => {
        const checkUnread = (messages) => {
            if (
                refList.current.scrollHeight - refList.current.scrollTop >=
                refList.current.clientHeight
            ) {
                dispatch(setBottomDialog(false));
            } else {
                dispatch(setBottomDialog(true));
            }
            messages
                .filter((e) => !e.read && !e.its_me)
                .forEach((e) => {
                    let bounds = document
                        .getElementById(e.message_id)
                        .getBoundingClientRect();
                    if (bounds.top <= window.innerHeight * 0.85) {
                        socket.emit('read_message', e.message_id, id);
                        let data_messages = {
                            user: id,
                            message_id: e.message_id,
                        };
                        dispatch(updateReadMessage(data_messages));
                    }
                });
        };
        checkUnread(chatMessages.get(id).messages);

        if (refList.current.scrollTop <= 0 && !isLoadMore) {
            loadMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadMore, loadMore]);

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
                    dispatch(loadMessages(data_messages));
                }
                setFetching(false);
            };
            socket.on('current_chat', listener);
            return () => socket.off('current_chat', listener);
        } else {
            history.push('/chat');
        }
        // }
    }, [dispatch, history, id, user_id]);

    // новое сообщение
    useEffect(() => {
        const listener = (data) => {
            if (
                refList.current.scrollHeight - refList.current.scrollTop >=
                refList.current.clientHeight
            ) {
                setIsLoadMore(true);
            } else {
                dispatch(setBottomDialog(true));
            }

            dispatch(
                updateMessages({
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
            setIsLoadMore(false);
        };
        socket.on('message', listener);
        return () => socket.off('message', listener);
    }, [dispatch]);

    // обновление прочитанности
    useEffect(() => {
        const listener = (data) => {
            if (
                refList.current.scrollHeight - refList.current.scrollTop >=
                refList.current.clientHeight
            ) {
                setIsLoadMore(true);
            } else {
                dispatch(setBottomDialog(true));
            }

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
                dispatch(updateReadMessage(data_messages));
            }
            setIsLoadMore(false);
        };

        socket.on('update_read_message', listener);
        return () => socket.off('update_read_message', listener);
    }, [dispatch, history, id]);

    const changeInputMessage = useCallback(
        (message) => setNewMessage(message),
        [],
    );

    // отправляем сообщение
    const onHandleSubmit = useCallback(() => {
        if (newMessage) {
            let newDate = +new Date();
            let newMessageId = uuidv4();
            dispatch(
                updateMessages({
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
            setNewMessage('');
            let data = {
                message_id: newMessageId,
                message: newMessage,
                time: newDate,
                id: id,
                isMessages: chatMessages.get(id).messages.length,
            };
            socket.emit('new_message', data);
        }
    }, [chatMessages, dispatch, id, newMessage]);

    // отправляем сообщение(с помощью клавиатуры)
    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                onHandleSubmit();
            }
        },
        [onHandleSubmit],
    );

    // прокрутка перед формированием дома
    useLayoutEffect(() => {
        setTimeout(() => {
            if (ref.current && chatMessages.get(id)?.messages && !isLoadMore) {
                ref.current.scrollIntoView({
                    block: 'end',
                    behavior: 'auto',
                });
                dispatch(setBottomDialog(true));
            }
        }, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatMessages, id]);

    const time = (timestamp) => {
        let newDate = dater(timestamp, i18n.language);
        return newDate;
    };

    return error ? (
        <div className="d-flex justify-conetent-center flex-column m-auto">
            <h2 className="text-center">{t('error')}</h2>
            <img
                className="error-img p-5"
                src="/images/logo-picture.png"
                alt=""
            />
        </div>
    ) : (
        <>
            <div className="chat-container-msg p-5 mb-4">
                <div className="cont-msg d-flex flex-column">
                    {!fetching ? (
                        <>
                            <h3 className="msg-username mt-3 text-center">
                                {chatMessages.get(id).fname}{' '}
                                {chatMessages.get(id).lname}
                            </h3>

                            <p className="msg-online-status text-center">
                                {chatMessages.get(id).online ? (
                                    <span>Online</span>
                                ) : (
                                    <span className="offline">Offline</span>
                                )}
                            </p>
                            <hr className="mt-0 ml-2 mr-2"></hr>
                            <div className="msglist-cont">
                                {chatMessages.get(id).messages.length ? (
                                    <div className="msglist-pos">
                                        <div
                                            className="overflow-auto"
                                            ref={refList}
                                            onScroll={listScroll}
                                        >
                                            {chatMessages
                                                .get(id)
                                                .messages.sort(function (a, b) {
                                                    return a.time - b.time;
                                                })
                                                .map((item, id) => (
                                                    <div
                                                        id={item.message_id}
                                                        className={
                                                            item.its_me
                                                                ? 'message-cont message-out ml-4 mr-4'
                                                                : 'message-cont message-in ml-4 mr-4'
                                                        }
                                                        key={id}
                                                    >
                                                        <div className="message">
                                                            <div className="current-msg">
                                                                <span>
                                                                    {
                                                                        item.message
                                                                    }
                                                                </span>
                                                                <div className="current-msg-time text-muted">
                                                                    {item.its_me && (
                                                                        <span className="arrows-unread">
                                                                            <svg
                                                                                aria-hidden="true"
                                                                                focusable="false"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 512 512"
                                                                                className="svg-read"
                                                                            >
                                                                                {!item.read ? (
                                                                                    <path
                                                                                        fill="#a961aa"
                                                                                        // fill="red"
                                                                                        d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                                                                                    ></path>
                                                                                ) : (
                                                                                    <path
                                                                                        fill="#a961aa"
                                                                                        // fill="green"
                                                                                        d="M505 174.8l-39.6-39.6c-9.4-9.4-24.6-9.4-33.9 0L192 374.7 80.6 263.2c-9.4-9.4-24.6-9.4-33.9 0L7 302.9c-9.4 9.4-9.4 24.6 0 34L175 505c9.4 9.4 24.6 9.4 33.9 0l296-296.2c9.4-9.5 9.4-24.7.1-34zm-324.3 106c6.2 6.3 16.4 6.3 22.6 0l208-208.2c6.2-6.3 6.2-16.4 0-22.6L366.1 4.7c-6.2-6.3-16.4-6.3-22.6 0L192 156.2l-55.4-55.5c-6.2-6.3-16.4-6.3-22.6 0L68.7 146c-6.2 6.3-6.2 16.4 0 22.6l112 112.2z"
                                                                                    ></path>
                                                                                )}
                                                                            </svg>
                                                                        </span>
                                                                    )}

                                                                    <span>
                                                                        {time(
                                                                            item.time,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            <div ref={ref}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="no-messages">
                                        {t('messages.nomessages')}
                                    </div>
                                )}
                            </div>

                            <div className="row-msg-input">
                                <InputMessage
                                    newMessage={newMessage}
                                    inputMessage={changeInputMessage}
                                    handleKeyPress={handleKeyPress}
                                />
                                <Button
                                    id="btn-send"
                                    onClick={onHandleSubmit}
                                    variant="primary"
                                >
                                    {t('messages.send')}
                                </Button>{' '}
                            </div>
                        </>
                    ) : (
                        <Container className="preload h-100 align-self-center">
                            <img src="/images/logo-picture.png" alt="" />
                        </Container>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chat;

// const onFocus = () => {
//     console.log('Tab is in focus');
// };

// const checkUnread = (messages) => {
//     messages
//         .filter((e) => !e.read)
//         .forEach((e) => {
//             if(document.getElementById(e.id).getClientBoundingRect();) {

//             }

//         });
//     // {
//     //     "message": "asdasd",
//     //     "read": true
//     // }
//     // {
//     //     "message": "asdasd",
//     //     "read": true
//     // }
//     // {
//     //     "message": "asdasd",
//     //     "read": false
//     // }

//     // сначла ищем
// };

// const onBlur = () => {
//     console.log('Tab is blurred');
// };

// useEffect(() => {
//     window.addEventListener('focus', onFocus);
//     window.addEventListener('blur', onBlur);
//     // Calls onFocus when the window first loads
//     onFocus();
//     // Specify how to clean up after this effect:
//     return () => {
//         window.removeEventListener('focus', onFocus);
//         window.removeEventListener('blur', onBlur);
//     };
// }, []);

// //
