import React, { useState, useEffect, useCallback } from 'react';
import { API_post } from '../../server/api';
import Form from 'react-bootstrap/Form';
import './Registration.scss';
import { Container, DropdownButton, InputGroup } from 'react-bootstrap';
import { FixedSizeList as List } from 'react-window';
import { useTranslation } from 'react-i18next';
import City from './city';

const CountryAndCity = ({ updateCountry, updateCity, isError }) => {
    const { t, i18n } = useTranslation();
    // const [lang, setLang] = useState(i18n.language);
    const [countriesList, setCountriesList] = useState([]);
    const [checkedCountry, setCheckedCountry] = useState(null);
    const [loadCities, setLoadCities] = useState(false);
    const [wideButton, setWideButton] = useState(false);
    const ref = React.useRef();

    useEffect(() => {
        const getCountries = async () => {
            const userData = await API_post('/location/get_country_list', {
                language: i18n.language,
            });
            if (userData[0] === 'error') {
                isError(userData[1]);
            } else {
                const data = userData[1];
                setCountriesList(data);
            }
        };
        getCountries();
    }, [i18n.language, isError]);

    // выбираем одну из стран
    const chooseCountry = useCallback(
        async (id) => {
            // если кликаем на выбор страны
            setWideButton(!wideButton);
            setCheckedCountry(countriesList[id].country_code);

            if (countriesList[id].country_code !== checkedCountry) {
                updateCountry(countriesList[id].country_code);
                setLoadCities(true);
            } else {
                console.log('та же самая страна');
            }

            // имитируем клик по документу, чтоб скрыть бутстраповский элемент
            document.body.click();
        },
        [checkedCountry, countriesList, updateCountry, wideButton],
    );

    // проверка на клик вне кнопки, если она выбрана
    useEffect(
        (e) => {
            const checkIfClickedOutside = (e) => {
                // Если клик на кнопке или за пределами блока со списком стран
                if (!loadCities) {
                    if (ref.current && !ref.current.contains(e.target)) {
                        setWideButton(false);
                    } else {
                        setWideButton(!wideButton);
                        // setShowSuggestions(false);
                    }
                }
            };
            // имитируем клик
            document.addEventListener('click', checkIfClickedOutside);
            return () => {
                document.removeEventListener('click', checkIfClickedOutside);
            };
        },
        [loadCities, wideButton],
    );

    const loadingCities = useCallback(() => {
        if (checkedCountry) {
            setLoadCities(false);
        }
    }, [checkedCountry]);

    const rowCountry = ({ index, style }) => (
        <div
            style={style}
            type="button"
            className="d-flex align-items-center pl-3 row-country dropdown-item"
            onMouseDown={() => chooseCountry(index)}
        >
            <div className="row-country-img" style={{}}>
                <img
                    src={require(`../../images/flags/${countriesList[
                        index
                    ].country_code.toLowerCase()}.png`)}
                    alt=""
                />
            </div>
            <span style={{ whiteSpace: 'pre-wrap' }}>
                {countriesList[index].country_name[i18n.language]}
            </span>
        </div>
    );

    return (
        <Form.Group size="lg">
            <Form.Label>
                <div>{t('auth.city')}</div>
            </Form.Label>
            <InputGroup
                className={wideButton || loadCities ? 'mb-3 wide' : 'mb3'}
            >
                {loadCities && (
                    <Container className="preload h-100 position-absolute align-items-stretch justify-content-end">
                        <img src="/images/logo-picture.png" alt="" />
                    </Container>
                )}
                <DropdownButton
                    className={
                        checkedCountry
                            ? 'country-check country-checked'
                            : 'country-check'
                    }
                    title={
                        !checkedCountry ? (
                            <>{t('auth.choosecountry')}</>
                        ) : (
                            <img
                                className="mr-2"
                                src={require(`../../images/flags/${checkedCountry.toLowerCase()}.png`)}
                                alt=""
                            />
                        )
                    }
                    id="input-group-dropdown-1"
                    ref={ref}
                    disabled={loadCities}
                >
                    <div>
                        <List
                            height={140}
                            itemCount={countriesList.length}
                            itemSize={35}
                        >
                            {rowCountry}
                        </List>
                    </div>
                </DropdownButton>
                <City
                    checkedCountry={checkedCountry}
                    updateCity={updateCity}
                    loadingCities={loadingCities}
                    isError={isError}
                />
            </InputGroup>
        </Form.Group>
    );
};

export default CountryAndCity;
