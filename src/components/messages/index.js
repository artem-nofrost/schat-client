import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import './Messages.scss';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

import InputMessage from './Input';
import Message from './Message';
import useMessages from './useMessages';
import useFocusedPage from '../../hooks/useFocusedPage';
import useElementScroll from '../../hooks/useElementScroll';

const Chat = () => {
    const { t } = useTranslation();
    const [element, setElement] = useState(false);
    const isFocusedPage = useFocusedPage();

    const { id } = useParams();
    const chatMessages = useSelector((state) => state.chat.messages);

    // ссылка на элемент со списком сообщений
    const refList = useCallback((node) => {
        if (node !== null) {
            setElement(node);
        }
    }, []);
    const scrollParams = useRef();

    const {
        loadMore,
        readMessage,
        addNewMessage,
        error,
        fetching,
        messageEvent,
    } = useMessages();
    const { scrollToBottom, bottom, top } = useElementScroll(element);

    useEffect(() => {
        if (top) {
            scrollParams.current = {
                top: element.scrollTop,
                height: element.scrollHeight,
            };
            loadMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [element, top]);

    const listScroll = useCallback(() => {
        const checkUnread = (messages) => {
            if (isFocusedPage) {
                messages
                    .filter((e) => !e.read && !e.its_me)
                    .forEach((e) => {
                        let bounds = document
                            .getElementById(e.message_id)
                            .getBoundingClientRect();
                        if (bounds.top <= window.innerHeight * 0.85) {
                            readMessage(e.message_id, id);
                        }
                    });
            }
        };
        checkUnread(chatMessages.get(id).messages);
    }, [chatMessages, id, isFocusedPage, readMessage]);

    const addNewMessageToList = useCallback(
        (newMessage) => {
            addNewMessage(newMessage);
        },
        [addNewMessage],
    );

    useEffect(() => {
        if (isFocusedPage && chatMessages.get(id)?.messages) {
            chatMessages
                .get(id)
                .messages.filter((e) => !e.read && !e.its_me)
                .forEach((e) => {
                    let bounds = document
                        .getElementById(e.message_id)
                        .getBoundingClientRect();
                    if (bounds.top <= window.innerHeight * 0.85) {
                        readMessage(e.message_id, id);
                    }
                });
        }
    }, [chatMessages, id, isFocusedPage, readMessage]);

    // прокрутка перед формированием дома
    useLayoutEffect(() => {
        if (!fetching) {
            setTimeout(scrollToBottom, 10);
        }
    }, [fetching, scrollToBottom]);

    useLayoutEffect(() => {
        switch (messageEvent) {
            case 'received':
                if (bottom) {
                    scrollToBottom();
                }
                break;
            case 'loaded_old':
                if (top) {
                    let oldScrollTop = scrollParams.current.top;
                    let oldScrollHeight = scrollParams.current.height;
                    let scrollNewPosition =
                        oldScrollTop + (element.scrollHeight - oldScrollHeight);
                    element.scrollTo(0, scrollNewPosition);
                }
                break;
            case messageEvent.match(/^added/)?.input:
                if (bottom) {
                    scrollToBottom();
                }
                break;
            default:
                break;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageEvent]);

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
                                {chatMessages.get(id).is_online ? (
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
                                                .map((item) => (
                                                    <Message
                                                        key={item.message_id}
                                                        message_id={
                                                            item.message_id
                                                        }
                                                        its_me={item.its_me}
                                                        message={item.message}
                                                        read={item.read}
                                                        time_message={item.time}
                                                        sent={item?.sent}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="no-messages">
                                        {t('messages.nomessages')}
                                    </div>
                                )}
                            </div>

                            <InputMessage addNewMessage={addNewMessageToList} />
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
