import React, { useContext } from 'react';
import { ThemeContext } from '../../App';
import NonAuthNav from './NonAuthNav';
import AuthNav from './AuthNav';
import './Header.scss';

import { useSelector } from 'react-redux';

export default function Header() {
    const { style, toggleStyle } = useContext(ThemeContext);

    const isAuth = useSelector((state) => state.user.is_auth);

    return isAuth ? (
        <AuthNav style={style} toggleStyle={toggleStyle} />
    ) : (
        <NonAuthNav style={style} toggleStyle={toggleStyle} />
    );
}
