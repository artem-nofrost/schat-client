import React, { useState, useEffect, useCallback } from 'react';
import { API_post } from '../../server/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useTranslation } from 'react-i18next';
import './Registration.scss';
import CountryAndCity from './Country';

const Registration = () => {
    const { t, i18n } = useTranslation();
    const [error, setError] = useState(null);
    const [errorData, setErrorData] = useState();
    const [fetching, setFetching] = useState(false);
    const [user, setUser] = useState({
        fname: '',
        lname: '',
        date: '',
        country: '',
        city: '',
        gender: '',
        email: '',
        password: '',
        language: i18n.language,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setErrorData('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [errorData]);

    const submit = async (e) => {
        e.preventDefault();
        if (!fetching) {
            setFetching(true);
            const userData = await API_post('/user/add', user);
            setFetching(false);
            if (userData[0] === 'errorData') {
                setErrorData(userData[1]);
            } else if (userData[0] === 'error') {
                setError(userData[1]);
            } else {
                const data = userData[1];
                localStorage.access_token = data.access_token;
                window.location.reload();
            }
        }
    };

    const updateCity = useCallback(
        (id) => setUser((user) => ({ ...user, city: id })),
        [],
    );
    const updateCountry = useCallback(
        (id) => setUser((user) => ({ ...user, country: id })),
        [],
    );
    const isError = useCallback((currentError) => setError(currentError), []);

    return error ? (
        <div>{t('error')}</div>
    ) : (
        <Container className="d-flex flex-grow-1 mt-4 mt-sm-0 mb-4 mb-sm-0">
            <div className="cont-login">
                <h3 className="caption text-center">
                    {t('auth.registration')}
                </h3>
                <Form className="form-login" onSubmit={submit}>
                    {errorData && (
                        <div className="err-form">
                            {errorData}
                            <div
                                className="remove"
                                onClick={(e) => setErrorData('')}
                            >
                                &times;
                            </div>
                        </div>
                    )}
                    <Form.Group size="lg">
                        <Form.Label>{t('auth.name')}</Form.Label>
                        <Form.Control
                            autoFocus
                            type="fname"
                            name="user[fname]"
                            value={user.fname}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    fname: e.target.value.trim(),
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group size="lg">
                        <Form.Label>{t('auth.surname')}</Form.Label>
                        <Form.Control
                            autoFocus
                            type="lname"
                            name="user[lname]"
                            value={user.lname}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    lname: e.target.value.trim(),
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group size="lg">
                        <Form.Label>{t('auth.birth')}</Form.Label>
                        <Form.Control
                            type="date"
                            name="user[date]"
                            value={user.date}
                            onChange={(e) =>
                                setUser({ ...user, date: e.target.value })
                            }
                        />
                    </Form.Group>

                    <CountryAndCity
                        updateCity={updateCity}
                        updateCountry={updateCountry}
                        isError={isError}
                    />

                    <Form.Group size="lg">
                        <Form.Label className="w-100">
                            {t('auth.gender')}
                        </Form.Label>
                        <Form.Check
                            inline
                            type="radio"
                            label={t('auth.male')}
                            name="user[gender]"
                            id="gender-male"
                            value="Male"
                            checked={user.gender === 'Male'}
                            onChange={(e) =>
                                setUser({ ...user, gender: e.target.value })
                            }
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label={t('auth.female')}
                            name="user[gender]"
                            id="gender-female"
                            value="Female"
                            checked={user.gender === 'Female'}
                            onChange={(e) =>
                                setUser({ ...user, gender: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group size="lg">
                        <Form.Label>{t('auth.email')}</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            name="user[email]"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group size="lg">
                        <Form.Label>{t('auth.pass')}</Form.Label>
                        <Form.Control
                            type="password"
                            name="user[password]"
                            value={user.password}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    password: e.target.value.trim(),
                                })
                            }
                            autoComplete="on"
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit">
                        {t('auth.register')}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default Registration;
