import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Search from './Search';
import Lang from './Lang';
import ThemeToggle from './ThemeToggle';
import Navbrand from './Navbrand';

function NonAuthNav(props) {
    return (
        <Navbar expand="lg" className="pt-4 pb-4">
            <Navbrand style={props.style} />
            <div className="d-flex flex-grow-1">
                <div className="cont-navbar">
                    <Search />
                    <Lang />
                    <ThemeToggle
                        style={props.style}
                        toggleStyle={props.toggleStyle}
                    />
                </div>
            </div>
        </Navbar>
    );
}

export default NonAuthNav;
