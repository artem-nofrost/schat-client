import React, { useCallback } from 'react';
import './Messages.scss';
import { useTranslation } from 'react-i18next';

const InputMessage = ({ newMessage, handleKeyPress, inputMessage }) => {
    const { t } = useTranslation();

    // отслеживаем изменения в инпуте
    const onHandleChange = useCallback(
        (e) => {
            inputMessage(e.target.value);
        },
        [inputMessage],
    );

    return (
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
    );
};

export default InputMessage;
