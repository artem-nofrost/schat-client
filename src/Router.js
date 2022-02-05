import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from './route/PrivateRouter';
import Login from './components/login';
import Registration from './components/registration';
import Main from './components/main';
import Search from './components/search';
import Profile from './components/profile';
import Chat from './components/chat';
import Messages from './components/messages';
import { useSelector } from 'react-redux';

export default function Router() {
    const isAuth = useSelector((state) => state.user.is_auth);
    return (
        <>
            <Switch>
                <Route path="/login">
                    {isAuth ? (
                        <Redirect
                            to={{
                                pathname: '/',
                            }}
                        />
                    ) : (
                        <Login />
                    )}
                </Route>
                <Route path="/Registration">
                    {isAuth ? (
                        <Redirect
                            to={{
                                pathname: '/',
                            }}
                        />
                    ) : (
                        <Registration />
                    )}
                </Route>
                <PrivateRoute exact path="/chat">
                    <Chat />
                </PrivateRoute>
                <PrivateRoute path="/chat/:id">
                    <Messages />
                </PrivateRoute>
                <Route exact path="/">
                    {isAuth ? (
                        <Redirect
                            to={{
                                pathname: '/chat',
                            }}
                        />
                    ) : (
                        <Main />
                    )}
                </Route>
                <Route exact path="/search">
                    <Search />
                </Route>
                <Route path="/profile/:id">
                    <Profile />
                </Route>
                <Route exact path="/profile/:id">
                    <Profile />
                </Route>
                <Route path="*">
                    <Redirect to="/" />
                </Route>
            </Switch>
        </>
    );
}
