import React, { useState, createContext, useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';

import store from './redux';
import Container from 'react-bootstrap/Container';

import Connect from './server/Connect';
import Header from './components/header';
import Router from './Router';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from './redux/reducers/actions';
import { get_access_token } from './server/user_token';
import { signIn } from './server/Auth';

export const ThemeContext = createContext(null);

const FollowAuthorization = () => {
    let canAuthenticate = get_access_token(); // наличие токены
    const defaultState = canAuthenticate ? 'waiting' : 'initial'; // есть токен или нету
    const [state, setState] = useState(defaultState);
    const dispatch = useDispatch();
    const isAuth = useSelector((state) => state.user.is_auth);
    const socket_state = useSelector((state) => state.socket.state);

    useEffect(() => {
        if (state === 'waiting') {
            setState('loading');
            signIn().then(([data, success]) => {
                if (success) {
                    dispatch(
                        setUserData({
                            is_auth: true,
                            id: data.id,
                            date: data.date,
                            email: data.email,
                            fname: data.fname,
                            gender: data.gender,
                            lname: data.lname,
                        }),
                    );
                } else {
                    setState('not_authenticated');
                }
            });
        }
    }, [state, dispatch]);

    useEffect(() => {
        if (isAuth) {
            setState('authenticated');
        }
    }, [isAuth]);

    if (state === 'loading' || state === 'waiting') {
        return (
            <Container>
                {/* <img src="/images/logo-picture.png" alt="" /> */}
            </Container>
        );
    }

    return (
        <>
            <Connect />
            <Container className="d-flex flex-column min-vh-100">
                {socket_state === 'connected' && (
                    <>
                        <Header />
                        <Router />
                    </>
                )}
            </Container>
        </>
    );
};

function App() {
    const theme = localStorage.getItem('theme')
        ? localStorage.getItem('theme')
        : 'light';
    const [style, setStyle] = useState(theme);

    const toggleStyle = useCallback(() => {
        setStyle(style === 'light' ? 'dark' : 'light');
        localStorage.setItem('theme', style === 'light' ? 'dark' : 'light');
    }, [style]);

    return (
        <ThemeContext.Provider value={{ style, toggleStyle }}>
            <div
                id="site-container"
                className={style === 'dark' ? 'dark' : 'light'}
            >
                <Provider store={store}>
                    <FollowAuthorization />
                </Provider>
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
