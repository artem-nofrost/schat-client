import React, { useState, useRef, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Search() {
    const { t } = useTranslation();
    const defaultShowSearch = window.innerWidth <= 400 ? false : true;
    const [showSearch, setShowSearch] = useState(defaultShowSearch);
    const [formData, updateFormData] = React.useState({
        search: '',
    });
    const history = useHistory();

    const inputRef = useRef();

    const sendParams = useCallback(() => {
        const queryParams = Object.keys(formData)
            .map((key) => key + '=' + formData[key])
            .join('&');

        history.push({
            pathname: '/search',
            search: '?' + decodeURIComponent(queryParams),
        });
    }, [formData, history]);

    const toSearch = useCallback(
        (e) => {
            e.preventDefault();
            if (window.innerWidth <= 400 && !showSearch) {
                setShowSearch(true);
                inputRef.current.focus();
            } else {
                // перенаправляем в компонент Search для дальнейшего поиска
                sendParams();
            }
        },
        [sendParams, showSearch],
    );

    const onKeyPress = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendParams();
            }
        },
        [sendParams],
    );

    const onBlur = useCallback(
        (e) => {
            if (window.innerWidth <= 400 && showSearch) {
                setShowSearch(false);
            }
        },
        [showSearch],
    );

    const onChange = (e) => {
        updateFormData({
            ...formData,

            [e.target.name]: e.target.value,
        });
    };

    return (
        <Form
            className={showSearch ? 'd-flex mr-auto show' : 'd-flex mr-auto'}
            onKeyPress={onKeyPress}
            action=""
        >
            <FormControl
                onBlur={onBlur}
                onChange={onChange}
                id="main-search"
                type="search"
                name="search"
                placeholder={t('header.search')}
                ref={inputRef}
            />
            <Button onMouseDown={toSearch} id="search-btn">
                <svg
                    height="16"
                    width="16"
                    viewBox="0 0 24 24"
                    fill="#535a52"
                    role="img"
                >
                    <path d="M10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6m13.12 2.88-4.26-4.26A9.842 9.842 0 0 0 20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10c1.67 0 3.24-.41 4.62-1.14l4.26 4.26a3 3 0 0 0 4.24 0 3 3 0 0 0 0-4.24"></path>
                </svg>
            </Button>
        </Form>
    );
}

export default Search;
