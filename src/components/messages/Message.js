import React, { useMemo } from 'react';
import './Messages.scss';
import { dater } from '../../lib/date';
import { useTranslation } from 'react-i18next';

const Message = ({ message_id, its_me, message, read, time_message, sent }) => {
    const { i18n } = useTranslation();

    const time = useMemo(() => {
        let newDate = dater(time_message, i18n.language);
        return newDate;
    }, [i18n.language, time_message]);

    return (
        <div
            id={message_id}
            className={
                its_me
                    ? 'message-cont message-out ml-4 mr-4'
                    : 'message-cont message-in ml-4 mr-4'
            }
        >
            <div className="message">
                <div className="current-msg">
                    <span>{message}</span>
                    <div className="current-msg-time text-muted">
                        {its_me && (
                            <span className="arrows-unread">
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="svg-read"
                                >
                                    {!read ? (
                                        <path
                                            fill="#a961aa"
                                            d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                                        ></path>
                                    ) : (
                                        <path
                                            fill="#a961aa"
                                            d="M505 174.8l-39.6-39.6c-9.4-9.4-24.6-9.4-33.9 0L192 374.7 80.6 263.2c-9.4-9.4-24.6-9.4-33.9 0L7 302.9c-9.4 9.4-9.4 24.6 0 34L175 505c9.4 9.4 24.6 9.4 33.9 0l296-296.2c9.4-9.5 9.4-24.7.1-34zm-324.3 106c6.2 6.3 16.4 6.3 22.6 0l208-208.2c6.2-6.3 6.2-16.4 0-22.6L366.1 4.7c-6.2-6.3-16.4-6.3-22.6 0L192 156.2l-55.4-55.5c-6.2-6.3-16.4-6.3-22.6 0L68.7 146c-6.2 6.3-6.2 16.4 0 22.6l112 112.2z"
                                        ></path>
                                    )}
                                </svg>
                            </span>
                        )}

                        <span>{time}</span>
                        <span>{sent === false && '⚠'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
