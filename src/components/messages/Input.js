import React, { useState, useCallback } from 'react';
import './Messages.scss';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const InputMessage = ({ addNewMessage }) => {
    const { t } = useTranslation();
    const [newMessage, setNewMessage] = useState('');

    // отправляем сообщение
    const onHandleSubmit = useCallback(() => {
        if (newMessage) {
            addNewMessage(newMessage);
            setNewMessage('');
        }
    }, [addNewMessage, newMessage]);

    // отправляем сообщение(с помощью клавиатуры)
    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                onHandleSubmit();
            }
        },
        [onHandleSubmit],
    );

    // отслеживаем изменения в инпуте
    const onHandleChange = useCallback((e) => {
        setNewMessage(e.target.value);
    }, []);

    return (
        <div className="row-msg-input">
            <input
                type="text"
                name=""
                id="message-input"
                className="form-control"
                autoComplete="off"
                placeholder={t('messages.message')}
                value={newMessage}
                onChange={onHandleChange}
                onKeyPress={handleKeyPress}
            />
            <Button id="btn-send" onClick={onHandleSubmit} variant="primary">
                {t('messages.send')}
            </Button>
        </div>
    );
};

export default InputMessage;
