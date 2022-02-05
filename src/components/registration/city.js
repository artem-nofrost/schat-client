import React, { useState, useEffect, useCallback } from 'react';
import { API_post } from '../../server/api';
import Form from 'react-bootstrap/Form';
import './Registration.scss';
import { FixedSizeList as List } from 'react-window';
import { useTranslation } from 'react-i18next';

const City = ({ checkedCountry, updateCity, loadingCities, isError }) => {
    const { t, i18n } = useTranslation();
    // const [lang, setLang] = useState(i18n.language);
    const [citiesList, setCitiesList] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(undefined);
    const [checkedCity, setCheckedCity] = useState(null);
    const [buttonScroll, setButtonScroll] = useState(false);

    useEffect(() => {
        const getCities = async () => {
            updateCity('');
            setUserInput('');
            setCheckedCity(null);

            const userData = await API_post('/location/get_cities_list', {
                code: checkedCountry,
                language: i18n.language,
            });
            if (checkedCountry) {
                loadingCities(false);
            }

            if (userData[0] === 'error') {
                isError(userData[1]);
            } else {
                const data = userData[1];
                setCitiesList(data);
            }
        };

        getCities();
    }, [checkedCountry, i18n.language, isError, loadingCities, updateCity]);

    // вводим город
    const onChange = useCallback(
        (e) => {
            if (checkedCountry) {
                const userInput = e.currentTarget.value;
                const filteredCities = citiesList.filter(
                    (city) =>
                        // city.name[lang]
                        city.name['en']
                            .toLowerCase()
                            .indexOf(userInput.toLowerCase()) > -1,
                );
                setFilteredSuggestions(filteredCities);
                setShowSuggestions(true);
                setActiveSuggestion(0);
                setButtonScroll(false);
                setUserInput(e.currentTarget.value);
            }
        },
        [checkedCountry, citiesList],
    );

    // если жмём кнопку Enter и листаем кнопками вверх/вниз
    const onKeyDown = useCallback(
        (e) => {
            if (showSuggestions && !e.repeat) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    setShowSuggestions(false);
                    setFilteredSuggestions([]);
                    setUserInput(
                        // filteredSuggestions[activeSuggestion].name[lang],
                        filteredSuggestions[activeSuggestion].name['en'],
                    );
                    setActiveSuggestion(0);
                    setButtonScroll(false);

                    setCheckedCity(filteredSuggestions[activeSuggestion].id);
                    updateCity(filteredSuggestions[activeSuggestion].id);
                } else if (e.keyCode === 38) {
                    if (activeSuggestion === 0) {
                        return;
                    }
                    setActiveSuggestion(activeSuggestion - 1);
                    setButtonScroll(true);
                } else if (e.keyCode === 40) {
                    if (activeSuggestion + 1 === filteredSuggestions.length) {
                        return;
                    }

                    setActiveSuggestion(activeSuggestion + 1);
                    setButtonScroll(true);
                }
            }
        },
        [activeSuggestion, filteredSuggestions, showSuggestions, updateCity],
    );

    useEffect(() => {
        if (buttonScroll) {
            document
                .getElementsByClassName('suggestion-active')[0]
                .scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                });
            setButtonScroll(false);
        }
    }, [buttonScroll]);

    // Выбираем город
    const onClick = useCallback(
        (e, id) => {
            setShowSuggestions(false);
            setFilteredSuggestions([]);
            setUserInput(e.currentTarget.innerText);
            setActiveSuggestion(0);
            setButtonScroll(false);
            setCheckedCity(id);
            updateCity(id);
        },
        [updateCity],
    );

    const rowCity = ({ index, style }) =>
        showSuggestions && filteredSuggestions.length && userInput ? (
            <li
                style={style}
                key={index}
                className={
                    activeSuggestion === index
                        ? 'suggestion-active pl-3 pr-3'
                        : 'pl-3 pr-3'
                }
                onClick={(e) => onClick(e, filteredSuggestions[index].id)}
            >
                {/* {filteredSuggestions[index].name[i18n.locale]} */}
                {filteredSuggestions[index].name['en']}
            </li>
        ) : null;

    return (
        <>
            <Form.Control
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                placeholder={checkedCountry && t('auth.entercity')}
            />
            <ul
                className="suggestions"
                style={{
                    display:
                        filteredSuggestions.length && userInput
                            ? 'block'
                            : 'none',
                }}
            >
                <List
                    height={Math.min(140, 35 * filteredSuggestions.length)}
                    itemCount={filteredSuggestions.length}
                    itemSize={35}
                >
                    {rowCity}
                </List>
            </ul>
            {checkedCity ? (
                <div
                    style={{
                        position: 'absolute',
                        right: '4px',
                        top: '4px',
                        color: '#853786',
                    }}
                >
                    ✓
                </div>
            ) : null}
        </>
    );
};

export default City;
