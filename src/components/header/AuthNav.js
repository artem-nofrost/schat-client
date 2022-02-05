import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Search from './Search';
import PrivateLang from './PrivateLang';
import ThemeToggle from './ThemeToggle';
import Navbrand from './Navbrand';
import ProfileLogo from './ProfileLogo';
// import NoticeLogo from './NoticeLogo';
import MessagesLogo from './MessagesLogo';

function AuthNav(props) {
    return (
        <Navbar expand="lg" className="pt-4 pb-4">
            <Navbrand style={props.style} />
            <div className="d-flex flex-grow-1">
                <div className="cont-navbar">
                    <Search />
                    {/* <NoticeLogo /> */}
                    <MessagesLogo />
                    <ProfileLogo>
                        <PrivateLang />
                        <ThemeToggle
                            style={props.style}
                            toggleStyle={props.toggleStyle}
                        />
                    </ProfileLogo>
                </div>
            </div>
        </Navbar>
    );
}

export default AuthNav;
