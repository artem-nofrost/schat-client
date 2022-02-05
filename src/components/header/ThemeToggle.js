import React from 'react';

function ThemeToggle(props) {
    return (
        <div className="theme-toggle logos-nav">
            <div
                className="theme-toggle-track"
                role="button"
                tabIndex="-1"
                onClick={props.toggleStyle}
            >
                <div
                    className="theme-toggle-track-check"
                    style={{ opacity: props.style === 'dark' ? 1 : 0 }}
                >
                    <span className="toggle_1" role="img" aria-label="Dark">
                        🌜
                    </span>
                </div>
                <div
                    className="theme-toggle-track-x"
                    style={{ opacity: props.style === 'light' ? 1 : 0 }}
                >
                    <span className="toggle_1" role="img" aria-label="Light">
                        🌞
                    </span>
                </div>
                <div className="react-toggle-thumb"></div>
            </div>
        </div>
    );
}

export default ThemeToggle;
