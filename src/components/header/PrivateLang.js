import React, { useCallback } from 'react';

function Lang() {
    const localLang =
        localStorage.getItem('lang') === 'en'
            ? localStorage.getItem('lang')
            : 'ru';

    const toggleLang = useCallback((e) => {
        const language = e.target.getAttribute('data-lang');
        localStorage.setItem('lang', language);
        window.location.reload();
    }, []);

    return (
        <div className="d-flex ml-auto lang">
            <div className="dropdown-lang">
                <div className="d-flex">
                    <div
                        onClick={toggleLang}
                        className={
                            localLang === 'en'
                                ? 'dropbtn-private dropen-private active-lang'
                                : 'dropbtn-private dropen-private'
                        }
                        data-lang="en"
                    >
                        EN
                    </div>
                    <div
                        onClick={toggleLang}
                        className={
                            localLang === 'ru'
                                ? 'dropbtn-private active-lang'
                                : 'dropbtn-private'
                        }
                        data-lang="ru"
                    >
                        RU
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lang;
