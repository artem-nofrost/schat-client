import React, { useCallback, useEffect, useState } from 'react';
import './Chat.scss';
import { useTranslation } from 'react-i18next';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { socket } from '../../server/socket';
import { useDispatch, useSelector } from 'react-redux';
import { updateDialogs, updateDialog } from '../../redux/reducers/actions';
import { dater } from '../../lib/date';
import { Link, useHistory } from 'react-router-dom';

const Chat = () => {
    const { t, i18n } = useTranslation();
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(true);

    const email = useSelector((state) => state.user.email);
    const chatDialogs = useSelector((state) => state.chat.dialogs);
    const dispatch = useDispatch();

    const ref = React.useRef([]);
    const history = useHistory();

    useEffect(() => {
        socket.emit('chatlist', {});

        const listener = (data) => {
            if (data.error) {
                setError(data.error);
                return;
            }
            let dataDialogs = new Map();
            for (let i = 0; i < data.length; i++) {
                dataDialogs.set(data[i].companion_id, {
                    last_msg_time: data[i].last_msg_time,
                    last_msg_id: data[i].last_msg_id,
                    last_msg: data[i].last_msg,
                    unread_messages: data[i].unread_messages,
                    its_me: data[i].its_me,
                    count_unread: data[i].count_unread,
                    fname: data[i].fname,
                    lname: data[i].lname,
                    is_online: data[i].is_online,
                });
            }

            dispatch(updateDialogs(dataDialogs));
            setFetching(false);
        };
        socket.on('chatlist', listener);
        return () => socket.off('chatlist', listener);
    }, [dispatch, email]);

    // обновляем сообщение у существующего диалога
    useEffect(() => {
        const listener = (data) => {
            let update_data = {
                user: data[0].companion_id,
                data: {
                    last_msg: data[0].message,
                    last_msg_id: data[0].last_message_id,
                    last_msg_time: data[0].time,
                    unread_messages: data[0].unread_messages,
                    its_me: data[0].its_me,
                    count_unread: data[0].count_unread,
                },
            };
            dispatch(updateDialog(update_data));
        };
        socket.on('update_chat_list', listener);
        return () => socket.off('update_chat_list', listener);
    }, [dispatch]);

    // добавляем новый диалог в список
    useEffect(() => {
        const listener = (data) => {
            let update_data = {
                user: data[0].companion_id,
                data: {
                    last_msg: data[0].message,
                    last_msg_id: data[0].last_message_id,
                    last_msg_time: data[0].time,
                    unread_messages: data[0].unread_messages,
                    its_me: data[0].its_me,
                    count_unread: data[0].count_unread,
                    fname: data[0].fname,
                    lname: data[0].lname,
                    is_online: data[0].is_online,
                },
            };
            dispatch(updateDialog(update_data));
        };
        socket.on('add_new_to_chat_list', listener);
        return () => socket.off('add_new_to_chat_list', listener);
    }, [dispatch]);

    // обновляем прочитанность сообщения
    useEffect(() => {
        const listener = (data) => {
            let update_data = {
                user: data.companion_id,
                data: {
                    unread_messages: data.unread_messages,
                    count_unread: data.count_unread,
                },
            };
            dispatch(updateDialog(update_data));
        };
        socket.on('update_chat_list_read', listener);
        return () => socket.off('update_chat_list_read', listener);
    }, [dispatch]);

    const time = (timestamp) => {
        let newDate = dater(timestamp, i18n.language);
        return newDate;
    };

    const toChat = useCallback(
        (e, id, user) => {
            if (!ref.current[id].contains(e.target)) {
                history.push('/chat/' + user);
            }
        },
        [history],
    );

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
            {!fetching ? (
                <div
                    className={
                        [...chatDialogs].length
                            ? 'p-5 chat-container-chat'
                            : 'p-5 chat-container-chat empty-dialogs'
                    }
                >
                    <Row xs={1} className="g-4">
                        <p className="h3 text-left pl-4">
                            {t('chat.messages')}
                        </p>
                        {[...chatDialogs].length ? (
                            [...chatDialogs]
                                .map(([name, value]) => ({ name, value }))
                                .sort(function (a, b) {
                                    return (
                                        b.value.last_msg_time -
                                        a.value.last_msg_time
                                    );
                                })
                                .map((item, id) => (
                                    <Col
                                        key={id}
                                        className="main-col"
                                        onClick={(e) =>
                                            toChat(e, id, item.name)
                                        }
                                    >
                                        <Card
                                            className={
                                                item.value.unread_messages &&
                                                !item.value.its_me
                                                    ? 'card-chat mt-4 unread-msg'
                                                    : 'card-chat mt-4'
                                            }
                                        >
                                            <Row className="p-2 p-md-4">
                                                <Col
                                                    xs={3}
                                                    className="align-self-center"
                                                >
                                                    <div className="position-relative d-flex justify-content-center">
                                                        <div className="cont-img-chat">
                                                            <Link
                                                                to={
                                                                    '/profile/' +
                                                                    item.name
                                                                }
                                                                ref={(
                                                                    element,
                                                                ) =>
                                                                    ref.current.push(
                                                                        element,
                                                                    )
                                                                }
                                                            >
                                                                <Card.Img
                                                                    src={require(`../../images/no-avatar.png`)}
                                                                    className="rounded-circle img-chat"
                                                                />
                                                                <div className="status-circle">
                                                                    <div
                                                                        className={
                                                                            item
                                                                                .value
                                                                                .is_online
                                                                                ? 'online '
                                                                                : null
                                                                        }
                                                                    ></div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={9}>
                                                    <Card.Body className="justify-content-center mw-100">
                                                        <Row>
                                                            <Col xs={8}>
                                                                <Card.Text className="name-msg text-dark h3">
                                                                    {
                                                                        item
                                                                            .value
                                                                            .fname
                                                                    }{' '}
                                                                    {
                                                                        item
                                                                            .value
                                                                            .lname
                                                                    }
                                                                </Card.Text>
                                                            </Col>
                                                            <Col
                                                                xs={4}
                                                                className="cont-time-msg"
                                                            >
                                                                <Card.Text className="time-msg">
                                                                    {time(
                                                                        item
                                                                            .value
                                                                            .last_msg_time,
                                                                    )}
                                                                </Card.Text>
                                                            </Col>
                                                        </Row>

                                                        <Card.Text className="text-muted last-msg h5 mt-3">
                                                            {item.value
                                                                .its_me && (
                                                                <span
                                                                    style={{
                                                                        height: '25px',
                                                                        width: '25px',
                                                                        position:
                                                                            'realative',
                                                                        display:
                                                                            'inline-block',
                                                                        marginRight:
                                                                            '0.5rem',
                                                                        verticalAlign:
                                                                            'middle',
                                                                    }}
                                                                >
                                                                    <Card.Img
                                                                        src={require(`../../images/no-avatar.png`)}
                                                                        className="rounded-circle img-fluid"
                                                                    />
                                                                </span>
                                                            )}

                                                            {
                                                                item.value
                                                                    .last_msg
                                                            }
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Col>
                                                {item.value.count_unread ? (
                                                    <div className="count-unread text-muted">
                                                        <span>
                                                            {
                                                                item.value
                                                                    .count_unread
                                                            }
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </Row>
                                        </Card>
                                    </Col>
                                ))
                        ) : (
                            <div className="cont-empty-text">
                                <h5 className="empty-text">
                                    {t('chat.nomessages')}
                                </h5>
                            </div>
                        )}
                    </Row>
                </div>
            ) : (
                <Container className="preload h-100">
                    <img src="/images/logo-picture.png" alt="" />
                </Container>
            )}
        </>
    );
};

export default Chat;
