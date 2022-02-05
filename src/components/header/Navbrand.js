import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';

function Navbrand(props) {
    const isAuth = useSelector((state) => state.user.is_auth);
    return (
        <Navbar.Brand href={isAuth ? '/chat' : '/'}>
            <Image
                src="/images/logo.png"
                className={props.style === 'dark' ? 'dark-img' : null}
            />
        </Navbar.Brand>
    );
}

export default Navbrand;
