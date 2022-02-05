import React, { useCallback, useEffect, useState } from 'react';
import { API_get, API_post } from '../../server/api';
import Button from 'react-bootstrap/Button';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    setLoadUsers,
    setUploadUsers,
    setNumUsers,
} from '../../redux/reducers/actions';
import { Card, Col, Container, Row } from 'react-bootstrap';
import './Search.scss';
import { useTranslation } from 'react-i18next';

const Search = () => {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [people, setPeople] = useState([]);
    const [numPeople, setNumPeople] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [isLoadMore, setIsLoadMore] = useState(false);

    const location = useLocation();
    const dispatch = useDispatch();
    const num_users = useSelector((state) => state.search.num_users);
    const loaded_users = useSelector((state) => state.search.loaded_users);
    const user_id = useSelector((state) => state.user.id);
    const isAuth = useSelector((state) => state.user.is_auth);

    const history = useHistory();

    const peopleLength = people.length;

    const loadMore = useCallback(async () => {
        if (numPeople !== peopleLength && !fetching) {
            let params = new URL(document.location).searchParams;
            const search = params.get('search');
            setIsLoadMore(true);
            const userData = await API_post('/search/load_more', {
                searchParam: search,
                skip: peopleLength,
            });
            setIsLoadMore(false);
            if (userData[0] === 'error') {
                setError(userData[1]);
            } else {
                const data = userData[1];
                setPeople((people) => [...people, ...data]);
                dispatch(setUploadUsers(data));
            }
        }
    }, [dispatch, fetching, numPeople, peopleLength]);

    const onScroll = useCallback(() => {
        var posTop =
            window.pageYOffset !== undefined
                ? window.pageYOffset
                : (
                      document.documentElement ||
                      document.body.parentNode ||
                      document.body
                  ).scrollTop;
        let offset = 50;
        if (
            posTop + window.innerHeight + offset >=
            document.body.scrollHeight
        ) {
            document.removeEventListener('scroll', onScroll);
            loadMore(); // смещаем на 5
        }
    }, [loadMore]);

    useEffect(
        (e) => {
            async function fetchPeople() {
                setFetching(true);
                const userData = await API_get(
                    '/search/list' + location.search,
                );
                setFetching(false);
                if (userData[0] === 'error') {
                    setError(userData[1]);
                } else {
                    const data = userData[1];
                    setNumPeople(data[1]);
                    setPeople(data[0]);
                    dispatch(setLoadUsers(data[0]));
                    dispatch(setNumUsers(data[1]));
                }
            }

            fetchPeople();
        },
        [dispatch, location.search],
    );

    useEffect(() => {
        if (!isLoadMore) {
            document.addEventListener('scroll', onScroll);
            return () => document.removeEventListener('scroll', onScroll);
        }
    }, [isLoadMore, onScroll]);

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
                <div>
                    <div
                        className="p-5 chat-container-search"
                        onScroll={(e) => onScroll(e)}
                    >
                        <h3 className="number-found">
                            <span className="found">{t('search.found')}</span>
                            {num_users}
                        </h3>
                        <hr className="mt-4 mb-1" />
                        <div>
                            <Row xs={1} sm={2} lg={3} className="g-4">
                                {loaded_users.map((item, id) => (
                                    <Col key={id}>
                                        <Card className="card-search mt-4">
                                            <div className="position-relative">
                                                <Card.Img
                                                    variant="top"
                                                    src={require(`../../images/no-avatar.png`)}
                                                    className="rounded-circle img-profile p-4"
                                                />
                                                <div className="status-circle">
                                                    <div
                                                        className={
                                                            item.is_online
                                                                ? 'online '
                                                                : null
                                                        }
                                                    ></div>
                                                </div>
                                            </div>

                                            <Card.Body className="justify-content-center mw-100">
                                                <Card.Title>
                                                    <div className="card-name text-center">
                                                        {item.fname}{' '}
                                                        {item.lname}
                                                    </div>
                                                </Card.Title>
                                                <Card.Text className="text-center text-dark">
                                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                                    {item.city_name},{' '}
                                                    {item.country_name}
                                                </Card.Text>
                                                <Row className="buttons-card">
                                                    <Button
                                                        className="pl-3 pr-3"
                                                        onClick={() => {
                                                            history.push({
                                                                pathname:
                                                                    '/profile/' +
                                                                    item._id,
                                                            });
                                                        }}
                                                    >
                                                        {t('search.profile')}
                                                    </Button>
                                                    {user_id !==
                                                        item._id.toString() &&
                                                    isAuth ? (
                                                        <Button
                                                            className="pl-3 pr-3"
                                                            onClick={() => {
                                                                history.push({
                                                                    pathname:
                                                                        '/chat/' +
                                                                        item._id,
                                                                });
                                                            }}
                                                        >
                                                            {t(
                                                                'search.message',
                                                            )}
                                                        </Button>
                                                    ) : null}
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>
                </div>
            ) : (
                <Container className="preload h-100">
                    <img src="/images/logo-picture.png" alt="" />
                </Container>
            )}
        </>
    );
};

export default Search;
