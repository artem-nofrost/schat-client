import React from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { socket } from '../../server/socket';

function MessagesLogo() {
    // const [unreadMessage, setUnredMessage] = useState(0);
    // const email = useSelector((state) => state.user.email);

    // useEffect(() => {
    //     socket.emit('countunread', email);
    //     const listener = (data) => {
    //         setUnredMessage(data);
    //     };
    //     socket.on('countunread', listener);
    //     return () => socket.off('chatlist', listener);
    // }, [email]);

    return (
        <div className="profile-logo logos-nav d-flex ml-3">
            <div>
                <Link to="/chat">
                    <div className="user-circle-2 position-relative">
                        <div>
                            <svg
                                className="nav-logo"
                                height="24"
                                width="24"
                                fill="#535a52"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                aria-label=""
                                role="img"
                            >
                                <path d="M18 12.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 18 12.5m-6 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 12 12.5m-6 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 6 12.5M12 0C5.925 0 1 4.925 1 11c0 2.653.94 5.086 2.504 6.986L2 24l5.336-3.049A10.93 10.93 0 0 0 12 22c6.075 0 11-4.925 11-11S18.075 0 12 0"></path>
                            </svg>
                            {/* {unreadMessage ? (
                                <div className="unread-message">
                                    <span>{unreadMessage}</span>
                                </div>
                            ) : null} */}
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default MessagesLogo;
