import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { LogoutButton } from './Logout';
import { Link } from 'react-router-dom';

function ProfileLogo({ children }) {
    const [visible, setVisible] = useState(false);
    const user = useSelector((state) => state.user);
    const ref = React.useRef();
    const id = useSelector((state) => state.user.id);

    const onClick = useCallback(() => {
        setVisible(!visible);
    }, [visible]);

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (visible && ref.current && !ref.current.contains(e.target)) {
                setVisible(false);
            }
        };

        document.addEventListener('mousedown', checkIfClickedOutside);

        return () => {
            document.removeEventListener('mousedown', checkIfClickedOutside);
        };
    }, [visible]);

    return (
        <div className="profile-logo logos-nav d-flex" ref={ref}>
            <div className="ml-3">
                <div className="user-circle" onClick={onClick}>
                    <div>
                        <svg
                            width="100%"
                            viewBox="-50 -50 100 100"
                            version="1.1"
                            preserveAspectRatio="xMidYMid meet"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>{user.fname + ' ' + user.lname}</title>
                            <text
                                fontSize="40px"
                                fill="#111"
                                dy="0.35em"
                                textAnchor="middle"
                            >
                                {user.fname.charAt(0)}
                            </text>
                        </svg>
                    </div>
                </div>
                {visible && (
                    <div className="account-options">
                        <div className="pl-3 pr-3">
                            <div className="mt-3 mb-2">
                                <Link
                                    onClick={() => setVisible(false)}
                                    to={'/profile/' + id}
                                >
                                    <div className="d-flex row ml-2 mr-2 justify-content-start">
                                        <div className="m-2 ml-2 account-picture">
                                            <div>
                                                <svg
                                                    width="100%"
                                                    viewBox="-50 -50 100 100"
                                                    version="1.1"
                                                    preserveAspectRatio="xMidYMid meet"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <title>
                                                        {user.fname +
                                                            ' ' +
                                                            user.lname}
                                                    </title>
                                                    <text
                                                        fontSize="40px"
                                                        fill="#111"
                                                        dy="0.35em"
                                                        textAnchor="middle"
                                                    >
                                                        {user.fname.charAt(0)}
                                                    </text>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="column ml-2 mr-3 mt-auto mb-auto">
                                            <div className="account-name">
                                                <div className="account-name-line text-dark">
                                                    {user.fname +
                                                        ' ' +
                                                        user.lname}
                                                </div>
                                            </div>
                                            <div className="account-email">
                                                <p className="account-email-line mb-auto text-muted">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <hr className="mt-4 ml-2 mr-2" />
                                <div className="mt-3 mb-3">
                                    <div className="ml-2 mr-2">
                                        {/* <Link to="/settings">
                                            <div className="ml-2 p-2 text-dark">
                                                {t('header.set')}
                                            </div>
                                        </Link> */}
                                        <LogoutButton />
                                    </div>
                                </div>
                                <hr className="mt-4 ml-2 mr-2" />
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="d-flex m-3">{children}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileLogo;
