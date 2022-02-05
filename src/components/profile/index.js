import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.scss';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { API_post } from '../../server/api';

const Profile = () => {
    const [error, setError] = useState(null);
    const [errorData, setErrorData] = useState();
    const [currentUser, setCurrentUser] = useState({});
    const [fetching, setFetching] = useState(true);
    const { t } = useTranslation();
    let { id } = useParams();

    useEffect(() => {
        const getUser = async () => {
            let userData = await API_post('/search/get_current_user', { id });
            setFetching(false);
            if (userData[0] === 'errorData') {
                setErrorData(userData[1]);
            } else if (userData[0] === 'error') {
                setError(userData[1]);
            } else {
                const data = userData[1];
                setCurrentUser(data);
            }
        };
        getUser();
    }, [id]);

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
            {errorData ? (
                <div className="d-flex justify-conetent-center flex-column m-auto">
                    <h2 className="text-center">{errorData}</h2>
                    <img
                        className="error-img p-5"
                        src="/images/logo-picture.png"
                        alt=""
                    />
                </div>
            ) : !fetching ? (
                <div className="p-5 chat-container-profile">
                    <Card className="card-search mt-4">
                        <Row xs={1} lg={2} className="m-auto w-100 p-0 p-sm-4">
                            <Col className="col-body">
                                <Card.Body className="justify-content-center mw-100 p-4">
                                    <Card.Title>
                                        <div className="card-name text-center">
                                            <h2 className="display-3 text-left">
                                                <span>{currentUser.fname}</span>{' '}
                                                <span className="position-relative">
                                                    {currentUser.lname}
                                                    <div className="status-circle-profile">
                                                        <div
                                                            className={
                                                                currentUser.is_online
                                                                    ? 'online '
                                                                    : null
                                                            }
                                                        ></div>
                                                    </div>
                                                </span>
                                            </h2>
                                        </div>
                                    </Card.Title>
                                    <Card.Text className="h5 text-muted text-left">
                                        {t('profile.aboutme')}
                                    </Card.Text>
                                    <hr className="mt-4 ml-2 mr-2" />
                                    <Card.Title>
                                        <div className="card-name text-left">
                                            <h3 className="mt-3">
                                                <span>
                                                    {t('profile.general')}
                                                </span>
                                                <span>{t('profile.info')}</span>
                                            </h3>
                                            <ListGroup className="mt-4 mt-lg-0 profile-list-group">
                                                <ListGroup.Item
                                                    className="text-muted pl-0"
                                                    style={{ border: 0 }}
                                                >
                                                    <span className="mr-2 text-dark">
                                                        {t('profile.city')}
                                                    </span>
                                                    <span className="data-profile">
                                                        {
                                                            currentUser.country_name
                                                        }
                                                        {', '}
                                                        {currentUser.city_name}
                                                    </span>
                                                </ListGroup.Item>
                                                <ListGroup.Item
                                                    className="text-muted pl-0"
                                                    style={{ border: 0 }}
                                                >
                                                    <span className="mr-2 text-dark">
                                                        {t('profile.email')}
                                                    </span>
                                                    <span className="data-profile">
                                                        {currentUser.email}
                                                    </span>
                                                </ListGroup.Item>
                                                <ListGroup.Item
                                                    className="text-muted pl-0"
                                                    style={{ border: 0 }}
                                                >
                                                    <span className="mr-2 text-dark">
                                                        {t('profile.phone')}
                                                    </span>
                                                    <span className="data-profile">
                                                        {t('profile.notlisted')}
                                                    </span>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    </Card.Title>
                                </Card.Body>
                            </Col>
                            <Col>
                                <div className="d-flex justify-content-center mt-3 mt-lg-0">
                                    <div className="position-relative">
                                        {' '}
                                        <Card.Img
                                            variant="top"
                                            src={require(`../../images/no-avatar.png`)}
                                            className="rounded-circle img-fluid p-4"
                                            style={{
                                                width: '300px',
                                                height: '300px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div className="status-circle-profile-mobile">
                                            <div
                                                className={
                                                    currentUser.is_online
                                                        ? 'online '
                                                        : null
                                                }
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <Row className="buttons-card">
                                    <Button className="pl-3 pr-3">
                                        {t('search.message')}
                                    </Button>
                                    <Button className="pl-3 pr-3">
                                        {t('profile.add')}
                                    </Button>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </div>
            ) : (
                <Container className="preload h-100">
                    <img src="/images/logo-picture.png" alt="" />
                </Container>
            )}
        </>
    );
};

export default Profile;
