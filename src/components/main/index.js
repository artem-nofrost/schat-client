import React from 'react';
import Button from 'react-bootstrap/Button';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Main.scss';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Home = () => {
    const { t } = useTranslation();
    const isAuth = useSelector((state) => state.user.is_auth);
    const history = useHistory();
    return (
        <Container>
            <Row
                xs={1}
                sm={2}
                lg={3}
                className="align-items-center mt-4 mt-sm-0 mb-4 mb-sm-0"
            >
                <Col className="m-auto">
                    <div>
                        <h3 className="display-4 main-caption">
                            {t('main.title')}
                        </h3>
                        <p className="h5 text-muted mt-4 mb-4 main-text">
                            {t('main.desc')}
                        </p>
                    </div>
                    <div className="pt-3 pb-3 d-flex cont-main-buttons">
                        <Button
                            onClick={() => {
                                isAuth
                                    ? history.push('/')
                                    : history.push('/login');
                            }}
                            className="main-button"
                            size="lg"
                        >
                            {t('auth.signin')}
                        </Button>
                        <Button
                            onClick={() => {
                                isAuth
                                    ? history.push('/')
                                    : history.push('/registration');
                            }}
                            className="main-button"
                            size="lg"
                        >
                            {t('auth.register')}
                        </Button>
                    </div>
                </Col>
                <Col className="m-auto">
                    <div className="mt-5">
                        <Image
                            src={require('../../images/mobile.png')}
                            alt=""
                            className="img-mobile"
                            fluid
                        />
                    </div>
                </Col>
            </Row>

            {/* <Row className="mt-5">
                <h3 className="h2 text-center">Преимущества</h3>
            </Row> */}
        </Container>
    );
};

export default Home;
